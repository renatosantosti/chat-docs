import CreateDocumentUseCase from "@/application/usecases/document/create/create-document-usecase";
import CreateDocumentRequest from "@/application/interfaces/use-cases/document/create/create-document-request";
import { CreateDocumentResponse } from "@/application/interfaces/use-cases/document/create/create-document-response";
import AuthUserDto from "@/domain/dtos/auth/user";
import Document from "@/domain/models/document";
import DocumentDto from "@/domain/dtos/document";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IDocumentRepository from "@/application/interfaces/repositories/document";
import IBaseMapper from "@/application/interfaces/base/base-mapper";
import { ExtractDocumentTextPagesService } from "@/application/services/extract-document-text-pages-service";
import { ISearchIndexerService } from "@/application/interfaces/services/semantic-indexer-service-interface";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { InternalError } from "@/shared/errors/internal-error";

describe("CreateDocumentUseCase", () => {
  let mockTimeProvider: jest.Mocked<ITimeAdapter>;
  let mockRepository: jest.Mocked<IDocumentRepository>;
  let mockMapper: jest.Mocked<IBaseMapper<Document, DocumentDto>>;
  let mockPdfDocService: jest.Mocked<ExtractDocumentTextPagesService>;
  let mockSearchIndexerService: jest.Mocked<ISearchIndexerService>;
  let useCase: CreateDocumentUseCase;
  let mockCurrentUser: AuthUserDto;

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

    mockPdfDocService = {
      pdfDocumentAdapter: {} as any,
      execute: jest.fn(),
    } as jest.Mocked<ExtractDocumentTextPagesService>;

    mockSearchIndexerService = {
      execute: jest.fn(),
    } as jest.Mocked<ISearchIndexerService>;

    useCase = new CreateDocumentUseCase(
      mockTimeProvider,
      mockRepository,
      mockMapper,
      mockPdfDocService,
      mockSearchIndexerService,
    );

    mockCurrentUser = {
      id: 1,
      uid: "test-uid-123",
      name: "Test User",
      email: "test@example.com",
    };
  });

  describe("Constructor", () => {
    it("should correctly assign dependencies", () => {
      // Assert
      expect(useCase.timeProvider).toBe(mockTimeProvider);
      expect(useCase.repository).toBe(mockRepository);
      expect(useCase.mapper).toBe(mockMapper);
      expect(useCase.pdfDocService).toBe(mockPdfDocService);
      expect(useCase.searchIndexerService).toBe(mockSearchIndexerService);
    });
  });

  describe("handler", () => {
    const validRequest: CreateDocumentRequest = {
      name: "Test Document",
      title: "Test Title",
      description: "Test Description",
      content: "base64Content",
      type: "pdf",
    };

    beforeEach(() => {
      mockTimeProvider.utcNow.mockReturnValue(new Date("2023-01-01T00:00:00Z"));
    });

    describe("Validation Rules", () => {
      it("should return BadRequestError when title is missing", async () => {
        // Arrange
        const invalidRequest = { ...validRequest, title: "" };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
        expect(result.message).toBe("Documeent title is required.");
      });

      it("should return BadRequestError when name is missing", async () => {
        // Arrange
        const invalidRequest = { ...validRequest, name: "" };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
        expect(result.message).toBe("Document name is required.");
      });

      it("should return BadRequestError when description is missing", async () => {
        // Arrange
        const invalidRequest = { ...validRequest, description: "" };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
        expect(result.message).toBe("Document name is required.");
      });

      it("should return BadRequestError when title is undefined", async () => {
        // Arrange
        const invalidRequest = { ...validRequest, title: undefined as any };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
      });

      it("should return BadRequestError when name is undefined", async () => {
        // Arrange
        const invalidRequest = { ...validRequest, name: undefined as any };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
      });

      it("should return BadRequestError when description is undefined", async () => {
        // Arrange
        const invalidRequest = {
          ...validRequest,
          description: undefined as any,
        };

        // Act
        const result = await useCase.handler(mockCurrentUser, invalidRequest);

        // Assert
        expect(result).toBeInstanceOf(BadRequestError);
      });
    });

    describe("PDF Processing Errors", () => {
      it("should return InternalError when pdfDocService throws error", async () => {
        // Arrange
        const pdfError = new Error("PDF processing failed");
        mockPdfDocService.execute.mockRejectedValueOnce(pdfError);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toBeInstanceOf(InternalError);
        expect(result.message).toBe(
          "An error occurred while try to get pdf from document.",
        );
        expect(mockPdfDocService.execute).toHaveBeenCalledWith(
          validRequest.content,
        );
      });

      it("should return InternalError when pdfDocService returns Error object", async () => {
        // Arrange
        const pdfError = new Error("Invalid PDF format");
        mockPdfDocService.execute.mockResolvedValueOnce(pdfError);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toBeInstanceOf(InternalError);
        expect(result.message).toBe(
          "An error occurred while try to get pdf from document.",
        );
      });
    });

    describe("Document Creation Flow", () => {
      it("should successfully create document with pages when pdfDocService returns pages", async () => {
        // Arrange
        const mockPages = ["Page 1 content", "Page 2 content"];
        const mockCreatedDocument: Document = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          pages: [
            {
              documentId: 0,
              pageNumber: 1,
              text: "Page 1 content",
              isActive: true,
              createdOn: new Date("2023-01-01T00:00:00Z"),
              createdBy: mockCurrentUser.email,
            },
            {
              documentId: 0,
              pageNumber: 2,
              text: "Page 2 content",
              isActive: true,
              createdOn: new Date("2023-01-01T00:00:00Z"),
              createdBy: mockCurrentUser.email,
            },
          ],
          numPages: 2,
          userId: mockCurrentUser.id,
          isActive: true,
          createdBy: mockCurrentUser.email,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };
        const mockDocumentDto: DocumentDto = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          numPages: 2,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };

        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(mockCreatedDocument);
        mockMapper.map.mockReturnValueOnce(mockDocumentDto);
        mockSearchIndexerService.execute.mockResolvedValueOnce(true);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toEqual({
          success: true,
          message: "Document created successfully.",
          document: mockDocumentDto,
        });
        expect(mockRepository.createOne).toHaveBeenCalledWith(
          expect.objectContaining({
            title: validRequest.title,
            name: validRequest.name,
            description: validRequest.description,
            content: validRequest.content,
            type: validRequest.type,
            userId: mockCurrentUser.id,
            numPages: 2,
            pages: expect.arrayContaining([
              expect.objectContaining({
                pageNumber: 1,
                text: "Page 1 content",
              }),
              expect.objectContaining({
                pageNumber: 2,
                text: "Page 2 content",
              }),
            ]),
          }),
        );
        expect(mockSearchIndexerService.execute).toHaveBeenCalledWith([
          {
            documentId: 1,
            documentName: validRequest.name,
            pageNumber: 1,
            content: "Page 1 content",
          },
          {
            documentId: 1,
            documentName: validRequest.name,
            pageNumber: 2,
            content: "Page 2 content",
          },
        ]);
      });

      it("should create document without pages when pdfDocService returns empty array", async () => {
        // Arrange
        const mockPages: string[] = [];
        const mockCreatedDocument: Document = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          pages: [],
          numPages: 0,
          userId: mockCurrentUser.id,
          isActive: true,
          createdBy: mockCurrentUser.email,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };
        const mockDocumentDto: DocumentDto = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          numPages: 0,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };

        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(mockCreatedDocument);
        mockMapper.map.mockReturnValueOnce(mockDocumentDto);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toEqual({
          success: true,
          message: "Document created successfully.",
          document: mockDocumentDto,
        });
        expect(mockRepository.createOne).toHaveBeenCalledWith(
          expect.objectContaining({
            numPages: 0,
            pages: [],
          }),
        );
        expect(mockSearchIndexerService.execute).not.toHaveBeenCalled();
      });

      it("should return InternalError when repository.createOne returns null", async () => {
        // Arrange
        const mockPages = ["Page 1 content"];
        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(null);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toBeInstanceOf(InternalError);
        expect(result.message).toBe(
          "Unknow error occurred while saving new document and try to create search index.",
        );
      });

      it("should return InternalError when repository.createOne throws error", async () => {
        // Arrange
        const mockPages = ["Page 1 content"];
        const repositoryError = new Error("Database connection failed");
        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockRejectedValueOnce(repositoryError);

        // Act
        const result = await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(result).toBeInstanceOf(InternalError);
        expect(result.message).toBe(
          "An error occurred while creating the document.",
        );
      });
    });

    describe("Search Index Integration", () => {
      it("should call searchIndexerService.execute with formatted pages", async () => {
        // Arrange
        const mockPages = ["Page 1 content", "Page 2 content"];
        const mockCreatedDocument: Document = {
          id: 123,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          createdBy: mockCurrentUser.email,
          pages: [
            {
              documentId: 0,
              pageNumber: 1,
              text: "Page 1 content",
              isActive: true,
              createdOn: new Date("2023-01-01T00:00:00Z"),
              createdBy: mockCurrentUser.email,
            },
            {
              documentId: 0,
              pageNumber: 2,
              text: "Page 2 content",
              isActive: true,
              createdOn: new Date("2023-01-01T00:00:00Z"),
              createdBy: mockCurrentUser.email,
            },
          ],
          numPages: 2,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };
        const mockDocumentDto: DocumentDto = {
          id: 123,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          numPages: 2,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };

        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(mockCreatedDocument);
        mockMapper.map.mockReturnValueOnce(mockDocumentDto);
        mockSearchIndexerService.execute.mockResolvedValueOnce(true);

        // Act
        await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(mockSearchIndexerService.execute).toHaveBeenCalledWith([
          {
            documentId: 123,
            documentName: validRequest.name,
            pageNumber: 1,
            content: "Page 1 content",
          },
          {
            documentId: 123,
            documentName: validRequest.name,
            pageNumber: 2,
            content: "Page 2 content",
          },
        ]);
      });

      it("should not call searchIndexerService when document has no pages", async () => {
        // Arrange
        const mockPages: string[] = [];
        const mockCreatedDocument: Document = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          pages: [],
          numPages: 0,
          userId: mockCurrentUser.id,
          isActive: true,
          createdBy: mockCurrentUser.email,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };
        const mockDocumentDto: DocumentDto = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          numPages: 0,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };

        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(mockCreatedDocument);
        mockMapper.map.mockReturnValueOnce(mockDocumentDto);

        // Act
        await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(mockSearchIndexerService.execute).not.toHaveBeenCalled();
      });
    });

    describe("Current User Assignment", () => {
      it("should set currentUser property when handler is called", async () => {
        // Arrange
        const mockPages = ["Page 1 content"];
        const mockCreatedDocument: Document = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          pages: [],
          numPages: 1,
          userId: mockCurrentUser.id,
          isActive: true,
          createdBy: mockCurrentUser.email,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };
        const mockDocumentDto: DocumentDto = {
          id: 1,
          name: validRequest.name,
          title: validRequest.title,
          description: validRequest.description,
          content: validRequest.content,
          type: validRequest.type,
          url: "",
          numPages: 1,
          userId: mockCurrentUser.id,
          isActive: true,
          createdOn: new Date("2023-01-01T00:00:00Z"),
        };

        mockPdfDocService.execute.mockResolvedValueOnce(mockPages);
        mockRepository.createOne.mockResolvedValueOnce(mockCreatedDocument);
        mockMapper.map.mockReturnValueOnce(mockDocumentDto);

        // Act
        await useCase.handler(mockCurrentUser, validRequest);

        // Assert
        expect(useCase.currentUser).toBe(mockCurrentUser);
      });
    });
  });
});
