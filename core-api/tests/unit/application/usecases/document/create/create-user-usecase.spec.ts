import CreateUserUseCase from "@/application/usecases/user/create-user/create-user-usecase";
import CreateUserRequest from "@/application/usecases/user/create-user/create-user-request";
import User from "@/domain/models/user";
import UserDto from "@/domain/dtos/user";
import { BadRequestError, EmailInUseError, MissingParamError, InternalError } from "@/shared/errors";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IUserRepository from "@/application/interfaces/repositories/user";
import IPasswordHashAdapter from "@/application/interfaces/adapters/password-hashing";
import IBaseMapper from "@/application/interfaces/base/base-mapper";

describe("CreateUserUseCase", () => {
  let mockTimeProvider: jest.Mocked<ITimeAdapter>;
  let mockRepository: jest.Mocked<IUserRepository>;
  let mockHashAdapter: jest.Mocked<IPasswordHashAdapter>;
  let mockMapper: jest.Mocked<IBaseMapper<User, UserDto>>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    mockTimeProvider = {
      utcNow: jest.fn(),
    } as jest.Mocked<ITimeAdapter>;

    mockRepository = {
        getOneByEmail: jest.fn(),
        createOne: jest.fn(),
        getOneById: jest.fn(),
        getAll: jest.fn(),
        deleteOneById: jest.fn(),
        updateOne: jest.fn(),
      } as jest.Mocked<IUserRepository>;

      mockHashAdapter = {
        createHash: jest.fn(),
      } as Partial<jest.Mocked<IPasswordHashAdapter>> as jest.Mocked<IPasswordHashAdapter>;

    mockMapper = {
      map: jest.fn(),
    } as Partial<jest.Mocked<IBaseMapper<User, UserDto>>> as jest.Mocked<IBaseMapper<User, UserDto>>;

    useCase = new CreateUserUseCase(
      mockTimeProvider,
      mockRepository,
      mockHashAdapter,
      mockMapper,
    );
  });
  
    describe("Constructor", () => {
    it("should correctly assign dependencies", () => {
      // Assert
      expect(useCase.timeProvider).toBe(mockTimeProvider);
      expect(useCase.repository).toBe(mockRepository);
      expect(useCase.hashAdapter).toBe(mockHashAdapter);
      expect(useCase.mapper).toBe(mockMapper);
    });
  });

  describe("handler", () => {
    it("should return BadRequestError if request is undefined", async () => {
      const result = await useCase.handler(undefined as unknown as CreateUserRequest);
      expect(result).toBeInstanceOf(BadRequestError);
    });

    it("should return BadRequestError if name is missing", async () => {
      const request = { email: "test@example.com", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(BadRequestError);
    });

    it("should return BadRequestError if email is missing", async () => {
      const request = { name: "Test User", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(BadRequestError);
    });

    it("should return MissingParamError if password is missing", async () => {
      const request = { name: "Test User", email: "test@example.com", repeatedPassword: "password" } as CreateUserRequest;
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(MissingParamError);
    });

    it("should return MissingParamError if repeatedPassword does not match password", async () => {
      const request = { name: "Test User", email: "test@example.com", password: "password", repeatedPassword: "wrongPassword" } as CreateUserRequest;
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(MissingParamError);
    });

    it("should return EmailInUseError if email already exists", async () => {
      const request = { name: "Test User", email: "test@example.com", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      mockRepository.getOneByEmail.mockResolvedValueOnce({} as User);
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(EmailInUseError);
    });

    it("should return InternalError if repository.createOne fails", async () => {
      const request = { name: "Test User", email: "test@example.com", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      mockRepository.getOneByEmail.mockResolvedValueOnce(null);
      mockHashAdapter.createHash.mockResolvedValueOnce("hashedPassword");
      mockTimeProvider.utcNow.mockReturnValueOnce(new Date());
      mockRepository.createOne.mockResolvedValueOnce(null);
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(InternalError);
    });

    it("should return success response if user is created successfully", async () => {
      const request = { name: "Test User", email: "test@example.com", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      const mockUser: User = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        isActive: true,
        password: "hashedPassword", // Inclua todas as propriedades necessárias do tipo User
        createdOn: new Date(),
        createdBy:"admin"
      };
      
      const mockUserDto: UserDto = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };

      mockRepository.getOneByEmail.mockResolvedValueOnce(null);
      mockHashAdapter.createHash.mockResolvedValueOnce("hashedPassword");
      mockTimeProvider.utcNow.mockReturnValueOnce(new Date());
      mockRepository.createOne.mockResolvedValueOnce(mockUser);
      mockMapper.map.mockReturnValueOnce(mockUserDto);

      const result = await useCase.handler(request);
      expect(result).toEqual({
        success: true,
        message: "User created successfully.",
        user: mockUserDto,
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      const request = { name: "Test User", email: "test@example.com", password: "password", repeatedPassword: "password" } as CreateUserRequest;
      mockRepository.getOneByEmail.mockRejectedValue(new Error("Unexpected error"));
      const result = await useCase.handler(request);
      expect(result).toBeInstanceOf(InternalError);
    });
  });
});
