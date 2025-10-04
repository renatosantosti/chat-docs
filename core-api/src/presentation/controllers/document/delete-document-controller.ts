import AuthUserDto from "@/domain/dtos/auth/user";
import { ErrorTypes } from "@/shared/errors/error-types";
import IBaseController from "@/application/interfaces/base/base-controller";
import IBaseHttpResponse from "@/application/interfaces/base/base-http-response";
import DeleteDocumentResponse from "@/application/interfaces/use-cases/document/delete/delete-document-reponse";
import DeleteDocumentRequest from "@/application/interfaces/use-cases/document/delete/delete-document-request";
import Joi from "joi";
import {
  badRequestHttpError,
  forbiddenHttpError,
  internalHttpError,
  notFoundHttpError,
  ok,
} from "@/presentation/helpers/http-helper";
import { inject, injectable } from "tsyringe";
import { isNotError } from "@/shared/utils/dto-is-error-type-guard ";
import { IDeleteDocumentUseCase } from "@/application/interfaces/use-cases/document/delete/delete-document-usecase-interface";

@injectable()
export default class DeleteDocumentController
  implements IBaseController<DeleteDocumentRequest, DeleteDocumentResponse>
{
  currentUser?: AuthUserDto;

  constructor(
    @inject("IDeleteDocumentUseCase") readonly useCase: IDeleteDocumentUseCase,
  ) {}

  public async handler(
    currentUser: AuthUserDto,
    request: DeleteDocumentRequest,
  ): Promise<IBaseHttpResponse<DeleteDocumentResponse | Error>> {
    this.currentUser = currentUser;

    try {
      // Create a joi schema to validate the request
      const requestValidationSchema = Joi.object({
        id: Joi.number().greater(0).required().messages({
          "any.required": "Document's ID is required",
          "number.greater": "Document's ID must be greater than 0",
        }),
      });

      console.log("DeleteDocumentController - Request:", request);
      console.log(
        "DeleteDocumentController - Request ID type:",
        typeof request.id,
      );
      console.log("DeleteDocumentController - Request ID value:", request.id);

      // Do a request validation
      const { error } = requestValidationSchema.validate(request);
      if (error) {
        console.error("Validation error:", error.details);
        return badRequestHttpError(error);
      }

      // Fires usecase handler
      const response: DeleteDocumentResponse | Error =
        await this.useCase.handler(this.currentUser, request);

      if (isNotError<DeleteDocumentResponse>(response)) {
        return ok(response);
      }
      // Othewise
      // Handle specific error types
      let responseError: IBaseHttpResponse<Error>;
      switch ((response as Error).name as ErrorTypes) {
        case ErrorTypes.BadRequestError:
          responseError = badRequestHttpError(response);
          break;
        case ErrorTypes.NotFoundError:
          responseError = notFoundHttpError(response);
          break;
        case ErrorTypes.AccessForbiddenError:
          responseError = forbiddenHttpError(response);
          break;
        default:
          responseError = internalHttpError(response);
      }
      return responseError;
    } catch (error: any) {
      console.error("Occured an error on DeleteDocumentController:", {
        error: error.message,
        name: error.name,
      });

      let responseError: IBaseHttpResponse<Error>;
      switch (error?.name as ErrorTypes) {
        case ErrorTypes.AccessForbiddenError:
          responseError = forbiddenHttpError(error as Error);
          break;
        default:
          responseError = internalHttpError(error);
      }
      return responseError;
    }
  }
}
