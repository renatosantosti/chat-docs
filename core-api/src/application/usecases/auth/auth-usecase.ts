import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IUserRepository from "@/application/interfaces/repositories/user";
import IPasswordHashAdapter from "@/application/interfaces/adapters/password-hashing";
import AuthRequest from "./auth-request";
import AuthResponse from "./auth-response";
import {
  BadRequestError,
  InternalError,
  MissingParamError,
  UnauthorizedError,
} from "@/shared/errors";
import AuthUserDto from "@/domain/dtos/auth/user";
import User from "@/domain/models/user";
import IAuthUseCase from "@/application/interfaces/use-cases/auth-usecase-interface";

/**
 * Implementation of the `IAuthUseCase` interface for handling authentication.
 * This use case is responsible for authenticating a user by validating their email and password.
 */
export default class AuthUseCase implements IAuthUseCase {
  /**
   * Constructs a new `AuthUseCase` instance.
   *
   * @param userRepository - The repository used to retrieve user data.
   * @param hashAdapter - The adapter used to handle password hashing and token creation.
   */
  constructor(
    readonly timeProvider: ITimeAdapter,
    readonly userRepository: IUserRepository,
    readonly hashAdapter: IPasswordHashAdapter,
  ) {}

  /**
   * Handles the authentication process based on the provided `AuthRequest`.
   *
   * @param request - The authentication request containing email, and password.
   * @returns A promise that resolves to an `AuthResponse` containing a JWT token if authentication is successful.
   * @throws An error if the email or password is invalid.
   *
   * Note: should be implemented resource logging and store token requests
   */
  async handler(request: AuthRequest): Promise<AuthResponse | Error> {
    // Validate that the provided email matches the user's email.
    if (!request.email) {
      return new BadRequestError("email");
    }

    if (!request.password) {
      return new BadRequestError("password");
    }

    let user: User | null = null;
    try {
      // Retrieve the user by company ID and email.
      user = await this.userRepository.getOneByEmail(request.email);
    } catch (error) {
      console.error("Error get user from repository. Details:", { error });
      return new InternalError("Error get user from repository.");
    }

    // Validate that the provided email matches the user's email.
    if (user?.email?.toLowerCase() !== request.email.toLowerCase()) {
      return new UnauthorizedError();
    }

    // Check if the provided password matches the stored hashed password.
    if (!this.hashAdapter.validateHash(request.password, user.password)) {
      return new UnauthorizedError();
    }

    if (user.id && user.name && user.email) {
      const token = await this.hashAdapter.createToken<AuthUserDto>({
        id: user.id,
        uid: String(user.id),
        name: user.name,
        email: user.email,
      } as AuthUserDto);

      // Return the authentication response with the generated token.
      return {
        success: true,
        message: "Token created successfully",
        token,
        userId: user.id!,
        userFullName: user.name,
        email: user.email,
      };
    }

    console.error("Unknow error to authenticate user:", {
      email: request.email,
    });
    return new InternalError("Unknow error to authenticate user.");
  }
}
