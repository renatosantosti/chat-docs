import IBaseUseCaseResponse from "@/application/interfaces/base/base-usecase-response";

/**
 * Response object for the authentication operation.
 * This object encapsulates the result of an authentication process, including the token,
 * and implements the base use case response structure.
 */
export class AuthResponse implements IBaseUseCaseResponse {
  /**
   * Indicates whether the use case operation was successful.
   */
  readonly success: boolean;

  /**
   * Provides a message related to the use case operation.
   * This message typically contains information about the operation result, such as an error or success message.
   */
  readonly message: string;

  /**
   * The authentication token generated upon successful login.
   */
  readonly token: string;
  /**
   * The authentication user´s id.
   */
  readonly userId: number;
  /**
   * The authentication user´s full name.
   */
  readonly userFullName: string;
  /**
   * The authentication user´s email.
   */
  readonly email: string;
  /**
   * Constructs a new AuthResponse object.
   *
   * @param success - Indicates whether the use case operation was successful.
   * @param message - Provides a message related to the operation result.
   * @param token - The authentication token generated upon successful login.
   */
  constructor(
    success: boolean,
    message: string,
    token: string,
    userId: number,
    userFullName: string,
    email: string,
  ) {
    this.success = success;
    this.message = message;
    this.token = token;
    this.userId = userId;
    this.userFullName = userFullName;
    this.email = email;
  }
}

export default AuthResponse;
