import AuthUserDto from "@/domain/dtos/auth/user";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IDocumentRepository from "@/application/interfaces/repositories/document";
import IBaseMapper from "@/application/interfaces/base/base-mapper";
import DocumentDto from "@/domain/dtos/document";
import Document from "@/domain/models/document";
import { InternalError } from "@/shared/errors/internal-error";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { isNotError } from "@/shared/utils/dto-is-error-type-guard ";
import { ExtractDocumentTextPagesService } from "@/application/services/extract-document-text-pages-service";
import { ISearchIndexerService } from "@/application/interfaces/services/semantic-indexer-service-interface";
import { DocumentTextPageDto } from "@/domain/dtos/search-dtos";
import { ICreateDocumentUseCase } from "@/application/interfaces/use-cases/document/create/create-document-usecase-interface";
import CreateDocumentRequest from "@/application/interfaces/use-cases/document/create/create-document-request";
import { CreateDocumentResponse } from "@/application/interfaces/use-cases/document/create/create-document-response";

/**
 * Use case for creating a new document.
 * This class handles the logic for creating a new document in the system.
 * It implements the IBaseUseCaseHandler interface to adhere to a standard request-response pattern.
 */
export default class CreateDocumentUseCase implements ICreateDocumentUseCase {
  public currentUser?: AuthUserDto;
  /**
   * Constructs a new CreateDocumentUseCase.
   *
   * @param currentDocument - The currently authenticated document.
   * @param timeProvider - The time provider used for obtaining the current UTC datetime.
   * @param mapper - Helper to map document model to DTO.
   */
  constructor(
    readonly timeProvider: ITimeAdapter,
    readonly repository: IDocumentRepository,
    readonly mapper: IBaseMapper<Document, DocumentDto>,
    readonly pdfDocService: ExtractDocumentTextPagesService,
    readonly searchIndexerService: ISearchIndexerService,
  ) {}

  /**
   * Handles the create document request.
   *
   * @param currentUser - The currently authenticated user. This parameter is required to ensure that the use case is executed in the context of the authenticated user.
   *                     It is typically used for authorization checks or to associate the operation with the user.
   * @param request - The request object containing the data needed to create a new document.
   * @returns A promise that resolves to a CreateDocumentResponse object containing the result of the document creation process.
   */

  async handler(
    currentUser: AuthUserDto,
    request: CreateDocumentRequest,
  ): Promise<CreateDocumentResponse | Error> {
    this.currentUser = currentUser;
    // Validations
    if (!request.title || request.title.length === 0) {
      return new BadRequestError("Documeent title is required.");
    }

    if (!request.name || request.name.length === 0) {
      return new BadRequestError("Document name is required.");
    }

    if (!request.description || request.description.length === 0) {
      return new BadRequestError("Document name is required.");
    }

    let pages: string[] | Error = [];

    try {
      pages = await this.pdfDocService.execute(request.content);
    } catch (error) {
      console.error("Error get pdf from document:", error);
      return new InternalError(
        "An error occurred while try to get pdf from document.",
      );
    }

    const newDocument: Document = {
      title: request.title,
      name: request.name,
      description: request.description,
      content: "", // no longer used to save content in the database
      type: request.type,
      url: "",
      pages: [],
      numPages: 0,
      userId: this.currentUser.id,
      isActive: true,
      createdOn: this.timeProvider.utcNow(),
      createdBy: this.currentUser.email,
    };

    try {
      if (isNotError(pages)) {
        let pageNumber = 1;
        pages.forEach((page) => {
          newDocument.pages.push({
            documentId: 0,
            pageNumber,
            text: page,
            isActive: true,
            createdOn: newDocument.createdOn,
            createdBy: newDocument.createdBy,
          });
          pageNumber++;
        });

        newDocument.numPages = pages.length; // set it here to avoid calculate column or view at this moment
      }

      const result = await this.repository.createOne(newDocument);

      if (!!result) {
        // Now, try to create search index to this new created document
        const formatedPages = newDocument.pages.map<DocumentTextPageDto>(
          (p) => ({
            documentId: result.id ?? 0,
            documentName: result.name,
            pageNumber: p.pageNumber,
            content: p.text,
          }),
        );

        this.searchIndexerService.execute(formatedPages);

        /**
         * TODO: save file in external storage
         */
        return {
          success: true,
          message: "Document created successfully.",
          document: result ? this.mapper.map(result) : undefined,
        };
      }

      return new InternalError(
        "Unknow error occurred while saving new document and try to create search index.",
      );
    } catch (error: any) {
      console.error("Error creating document:", error);
      return new InternalError(
        "An error occurred while creating the document.",
      );
    }
  }
}
