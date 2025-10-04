import DeleteDocumentUseCase from "@/application/usecases/document/delete/delete-document-usecase";
import DeleteDocumentRequest from "@/application/interfaces/use-cases/document/delete/delete-document-request";
import AuthUserDto from "@/domain/dtos/auth/user";
import Document from "@/domain/models/document";
import DocumentDto from "@/domain/dtos/document";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IDocumentRepository from "@/application/interfaces/repositories/document";
import IBaseMapper from "@/application/interfaces/base/base-mapper";
import { IDeleteSearchIndexService } from "@/application/interfaces/services/delete-search-index-service-interface";
import { AccessForbiddenError } from "@/shared/errors/access-forbidden-error";
import { InternalError } from "@/shared/errors/internal-error";
import { NotFoundError } from "@/shared/errors/not-found-error";

describe("DeleteDocumentUseCase", () => {
  let mockTimeProvider: jest.Mocked<ITimeAdapter>;
  let mockRepository: jest.Mocked<IDocumentRepository>;
  let mockMapper: jest.Mocked<IBaseMapper<Document, DocumentDto>>;
  let mockDeleteSearchIndexService: jest.Mocked<IDeleteSearchIndexService>;
  let useCase: DeleteDocumentUseCase;
  let mockCurrentUser: AuthUserDto;
  let mockDocument: Document;

  beforeEach(() => {
    mockTimeProvider = {
      utcNow: jest.fn(),
    } as jest.Mocked<ITimeAdapter>;

    mockRepository = {
      getOneById: jest.fn(),
      getAll: jest.fn(),
      getAllByUserId: jest.fn(),
      createOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOneById: jest.fn(),
    } as jest.Mocked<IDocumentRepository>;

    mockMapper = {
      map: jest.fn(),
    } as Partial<
      jest.Mocked<IBaseMapper<Document, DocumentDto>>
    > as jest.Mocked<IBaseMapper<Document, DocumentDto>>;

    mockDeleteSearchIndexService = {
      execute: jest.fn(),
    } as jest.Mocked<IDeleteSearchIndexService>;

    useCase = new DeleteDocumentUseCase(
      mockTimeProvider,
      mockRepository,
      mockMapper,
      mockDeleteSearchIndexService,
    );

    mockCurrentUser = {
      id: 1,
      uid: "test-uid-123",
      name: "Test User",
      email: "test@example.com",
    };

    mockDocument = {
      id: 1,
      name: "Test Document",
      title: "Test Document",
      description: "Test Description",
      content: "Test Content",
      numPages: 1,
      pages: [],
      userId: 1,
      isActive: true,
      createdOn: new Date(),
      createdBy: "test@example.com",
    };
  });

  describe("Constructor", () => {
    it("should correctly assign dependencies", () => {
      // Assert
      expect(useCase.timeProvider).toBe(mockTimeProvider);
      expect(useCase.repository).toBe(mockRepository);
      expect(useCase.mapper).toBe(mockMapper);
      expect(useCase.deleteSearchIndexService).toBe(
        mockDeleteSearchIndexService,
      );
    });
  });

  describe("handler", () => {
    const mockRequest: DeleteDocumentRequest = { id: 1 };

    it("should return NotFoundError when document is not found", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValueOnce(null);

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toBeInstanceOf(NotFoundError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).not.toHaveBeenCalled();
      expect(mockDeleteSearchIndexService.execute).not.toHaveBeenCalled();
    });

    it("should return AccessForbiddenError when user is not the owner of the document", async () => {
      // Arrange
      const documentWithDifferentUser = { ...mockDocument, userId: 2 };
      mockRepository.getOneById.mockResolvedValueOnce(
        documentWithDifferentUser,
      );

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toBeInstanceOf(AccessForbiddenError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).not.toHaveBeenCalled();
      expect(mockDeleteSearchIndexService.execute).not.toHaveBeenCalled();
    });

    it("should return success false when repository delete fails", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValueOnce(mockDocument);
      mockRepository.deleteOneById.mockResolvedValueOnce(false);

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Unknown error to delete document.",
      });
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockDeleteSearchIndexService.execute).not.toHaveBeenCalled();
    });

    it("should successfully delete document and search index", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValueOnce(mockDocument);
      mockRepository.deleteOneById.mockResolvedValueOnce(true);
      mockDeleteSearchIndexService.execute.mockResolvedValueOnce(true);

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Document deleted successfully.",
      });
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockDeleteSearchIndexService.execute).toHaveBeenCalledWith("1");
    });

    it("should successfully delete document even when search index deletion fails", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValueOnce(mockDocument);
      mockRepository.deleteOneById.mockResolvedValueOnce(true);
      mockDeleteSearchIndexService.execute.mockResolvedValueOnce(false);

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Document deleted successfully.",
      });
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockDeleteSearchIndexService.execute).toHaveBeenCalledWith("1");
    });

    it("should successfully delete document even when search index service throws error", async () => {
      // Arrange
      const searchIndexError = new Error("ElasticSearch connection failed");
      mockRepository.getOneById.mockResolvedValueOnce(mockDocument);
      mockRepository.deleteOneById.mockResolvedValueOnce(true);
      mockDeleteSearchIndexService.execute.mockRejectedValueOnce(
        searchIndexError,
      );

      // Act
      const result = await useCase.handler(mockCurrentUser, mockRequest);

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Document deleted successfully.",
      });
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockDeleteSearchIndexService.execute).toHaveBeenCalledWith("1");
    });

    it("should throw InternalError when repository.getOneById throws error", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.getOneById.mockRejectedValueOnce(repositoryError);

      // Act & Assert
      await expect(
        useCase.handler(mockCurrentUser, mockRequest),
      ).rejects.toThrow(InternalError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).not.toHaveBeenCalled();
      expect(mockDeleteSearchIndexService.execute).not.toHaveBeenCalled();
    });

    it("should throw InternalError when repository.deleteOneById throws error", async () => {
      // Arrange
      const repositoryError = new Error("Database delete failed");
      mockRepository.getOneById.mockResolvedValueOnce(mockDocument);
      mockRepository.deleteOneById.mockRejectedValueOnce(repositoryError);

      // Act & Assert
      await expect(
        useCase.handler(mockCurrentUser, mockRequest),
      ).rejects.toThrow(InternalError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(mockRequest.id);
      expect(mockDeleteSearchIndexService.execute).not.toHaveBeenCalled();
    });

    it("should handle different document IDs correctly", async () => {
      // Arrange
      const differentRequest: DeleteDocumentRequest = { id: 999 };
      const differentDocument = { ...mockDocument, id: 999 };
      mockRepository.getOneById.mockResolvedValueOnce(differentDocument);
      mockRepository.deleteOneById.mockResolvedValueOnce(true);
      mockDeleteSearchIndexService.execute.mockResolvedValueOnce(true);

      // Act
      const result = await useCase.handler(mockCurrentUser, differentRequest);

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Document deleted successfully.",
      });
      expect(mockRepository.getOneById).toHaveBeenCalledWith(999);
      expect(mockRepository.deleteOneById).toHaveBeenCalledWith(999);
      expect(mockDeleteSearchIndexService.execute).toHaveBeenCalledWith("999");
    });

    it("should handle zero document ID", async () => {
      // Arrange
      const zeroRequest: DeleteDocumentRequest = { id: 0 };
      mockRepository.getOneById.mockResolvedValueOnce(null);

      // Act
      const result = await useCase.handler(mockCurrentUser, zeroRequest);

      // Assert
      expect(result).toBeInstanceOf(NotFoundError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(0);
    });

    it("should handle negative document ID", async () => {
      // Arrange
      const negativeRequest: DeleteDocumentRequest = { id: -1 };
      mockRepository.getOneById.mockResolvedValueOnce(null);

      // Act
      const result = await useCase.handler(mockCurrentUser, negativeRequest);

      // Assert
      expect(result).toBeInstanceOf(NotFoundError);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(-1);
    });
  });
});
