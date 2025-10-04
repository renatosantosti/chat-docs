import IPasswordHashAdapter from "@/application/interfaces/adapters/password-hashing";
import ITimeAdapter from "@/application/interfaces/adapters/time-provider";
import IBaseMapper from "@/application/interfaces/base/base-mapper";
import IDocumentRepository from "@/application/interfaces/repositories/document";
import IUserRepository from "@/application/interfaces/repositories/user";
import IAuthUseCase from "@/application/interfaces/use-cases/auth-usecase-interface";
import { IChatDocUseCase } from "@/application/interfaces/use-cases/chat-doc/chatdoc-usecase-interface";
import { ICreateUserUseCase } from "@/application/interfaces/use-cases/create-user-usecase-interface";
import { IGetAllDocumentUseCase } from "@/application/interfaces/use-cases/document/get-all/get-all-document-usecase-interface";
import { IGetDocumentUseCase } from "@/application/interfaces/use-cases/document/get/get-document-usecase-interface";
import { IGetUserUseCase } from "@/application/interfaces/use-cases/get-user-usecase-interface";
import ILiveUseCase from "@/application/interfaces/use-cases/live-usecase-interface";
import { ISearchTermUseCase } from "@/application/interfaces/use-cases/search-usecase-interface";
import { IUpdateUserUseCase } from "@/application/interfaces/use-cases/update-user-usecase-interface";
import { ExtractDocumentTextPagesService } from "@/application/services/extract-document-text-pages-service";
import { SearchIndexerService } from "@/application/services/indexer-pages-service";
import { DeleteSearchIndexService } from "@/application/services/delete-search-index-service";
import AuthUseCase from "@/application/usecases/auth/auth-usecase";
import ChatDocUseCase from "@/application/usecases/chatdoc/chatdoc-usecase";
import CreateDocumentUseCase from "@/application/usecases/document/create/create-document-usecase";
import DeleteDocumentUseCase from "@/application/usecases/document/delete/delete-document-usecase";
import GetAllDocumentUseCase from "@/application/usecases/document/get-all/get-all-document-usecase";
import GetDocumentUseCase from "@/application/usecases/document/get/get-document-usecase";
import UpdateDocumentUseCase from "@/application/usecases/document/update/update-document-usecase";
import LiveUseCase from "@/application/usecases/live/use-case";
import SearchTermUseCase from "@/application/usecases/search/search-usecase";
import CreateUserUseCase from "@/application/usecases/user/create-user/create-user-usecase";
import GetUserUseCase from "@/application/usecases/user/get-user/get-user-usecase";
import UpdateUserUseCase from "@/application/usecases/user/update-user/update-user-usecase";
import { elasticSearchConfig, openAiApiConfig } from "@/config";
import DocumentDto from "@/domain/dtos/document";
import UserDto from "@/domain/dtos/user";
import Document from "@/domain/models/document";
import User from "@/domain/models/user";
import OpenAIGptTextAdapter from "@/infrastructure/adapters/open-ai-gpt-text-adapter";
import PasswordHashAdapter from "@/infrastructure/adapters/password-hash-adapter";
import { PDFDocumentAdapter } from "@/infrastructure/adapters/pdf-document-adapter";
import { SlasticSearchIndexer } from "@/infrastructure/adapters/slastic-search-indexer-adapter";
import TimeProvider from "@/infrastructure/adapters/time-provider-adapter";
import DocumentEntity from "@/infrastructure/database/entities/document";
import UserEntity from "@/infrastructure/database/entities/user";
import { DocumentEntityMapper } from "@/infrastructure/database/mappers/document-entity-to-model";
import { UserEntityMapper } from "@/infrastructure/database/mappers/user-entity-to-model";
import { DocumentMapper } from "@/mappers/document-mapper";
import { UserMapper } from "@/mappers/user-mapper";
import DocumentRepository from "@/persistence/document-repository";
import UserRepository from "@/persistence/user-repository";
import AuthController from "@/presentation/controllers/auth";
import ChatDocController from "@/presentation/controllers/chat-doc/chat-doc-controller";
import CreateDocumentController from "@/presentation/controllers/document/create-document-controller";
import DeleteDocumentController from "@/presentation/controllers/document/delete-document-controller";
import GetAllDocumentController from "@/presentation/controllers/document/get-all-document-controller";
import GetDocumentController from "@/presentation/controllers/document/get-document-controller";
import UpdateDocumentController from "@/presentation/controllers/document/update-document-controller";
import SearchTermController from "@/presentation/controllers/search/search-term-controller";
import CreateUserController from "@/presentation/controllers/user/create-user-controller";
import GetUserController from "@/presentation/controllers/user/get-user-controller";
import UpdateUserController from "@/presentation/controllers/user/update-user-controller";
import { OpenAIChatEnumModels } from "@/presentation/helpers/openai-embedding-models";
import { container } from "tsyringe";
import { IUpdateDocumentUseCase } from "@/application/interfaces/use-cases/document/update/update-document-usecase-interface";
import { IDeleteDocumentUseCase } from "@/application/interfaces/use-cases/document/delete/delete-document-usecase-interface";
import { IGetDocumentSuggestionsUseCase } from "@/application/interfaces/use-cases/document/get-suggestions/get-document-suggestions-usecase-interface";
import { GetDocumentSuggestionsUseCase } from "@/application/usecases/document/get-sugestions/get-document-sugestions-usecase";
import { ICreateDocumentUseCase } from "@/application/interfaces/use-cases/document/create/create-document-usecase-interface";
import GetDocSuggestionsController from "@/presentation/controllers/document/get-document-suggestions-controller";

/* Register all adapters as singletons*/
container.registerSingleton<ITimeAdapter>("ITimeAdapter", TimeProvider);
container.registerSingleton<IPasswordHashAdapter>(
  "IPasswordHashAdapter",
  PasswordHashAdapter,
);

/* Register all mappers */
const userMapper = new UserMapper();
const documentMapper = new DocumentMapper();
const userEntityMapper = new UserEntityMapper();
const documentEntityMapper = new DocumentEntityMapper();
container.registerInstance<IBaseMapper<User, UserDto>>(
  "UserMapper",
  userMapper,
);
container.registerInstance<IBaseMapper<Document, DocumentDto>>(
  "DocumentMapper",
  documentMapper,
);
container.registerInstance<IBaseMapper<User, Partial<UserEntity>>>(
  "UserEntityMapper",
  userEntityMapper,
);
container.registerInstance<IBaseMapper<Document, Partial<DocumentEntity>>>(
  "DocumentEntityMapper",
  documentEntityMapper,
);

/* Register all repositories */
container.registerInstance<IUserRepository>(
  "IUserRepository",
  new UserRepository(
    container.resolve<IBaseMapper<User, Partial<UserEntity>>>(
      "UserEntityMapper",
    ),
  ),
);
container.registerInstance<IDocumentRepository>(
  "IDocumentRepository",
  new DocumentRepository(
    container.resolve<IBaseMapper<Document, Partial<DocumentEntity>>>(
      "DocumentEntityMapper",
    ),
  ),
);

/* Shared instances */
const timeProvider = container.resolve<ITimeAdapter>("ITimeAdapter");
const passwordHash = container.resolve<IPasswordHashAdapter>(
  "IPasswordHashAdapter",
);

/* Register all usecases for user*/
const userRepository = container.resolve<IUserRepository>("IUserRepository");

const createUserUseCase = new CreateUserUseCase(
  timeProvider,
  userRepository,
  passwordHash,
  userMapper,
);
const getUserUseCase = new GetUserUseCase(
  timeProvider,
  userRepository,
  userMapper,
);
const updateUserUseCase = new UpdateUserUseCase(
  timeProvider,
  userRepository,
  passwordHash,
  userMapper,
);

container.registerInstance<ICreateUserUseCase>(
  "ICreateUserUseCase",
  createUserUseCase,
);
container.registerInstance<IGetUserUseCase>("IGetUserUseCase", getUserUseCase);
container.registerInstance<IUpdateUserUseCase>(
  "IUpdateUserUseCase",
  updateUserUseCase,
);

/* Register all usecases for document*/

// Set param requirements
const documentRepository = container.resolve<IDocumentRepository>(
  "IDocumentRepository",
);
const openAiAdaptter = new OpenAIGptTextAdapter(
  openAiApiConfig.apiKey,
  openAiApiConfig.chatModel as OpenAIChatEnumModels,
);
const slasticSearchIndexer = new SlasticSearchIndexer(
  elasticSearchConfig.host,
  elasticSearchConfig.port,
  elasticSearchConfig.apiKey,
  elasticSearchConfig.user,
  elasticSearchConfig.password,
  openAiApiConfig.embeddingDims,
);
const pdfDocService = new ExtractDocumentTextPagesService(
  new PDFDocumentAdapter(),
);
const searchIndexerService = new SearchIndexerService(
  elasticSearchConfig.indexName,
  openAiAdaptter,
  slasticSearchIndexer,
);
const deleteSearchIndexService = new DeleteSearchIndexService(
  elasticSearchConfig.indexName,
  slasticSearchIndexer,
);

//Finally, create all uses cases and register those instances
const createDocumentUseCase = new CreateDocumentUseCase(
  timeProvider,
  documentRepository,
  documentMapper,
  pdfDocService,
  searchIndexerService,
);
const deleteDocumentUseCase = new DeleteDocumentUseCase(
  timeProvider,
  documentRepository,
  documentMapper,
  deleteSearchIndexService,
);
const getAllDocumentUseCase = new GetAllDocumentUseCase(
  timeProvider,
  documentRepository,
  documentMapper,
);
const getDocumentUseCase = new GetDocumentUseCase(
  timeProvider,
  documentRepository,
  documentMapper,
);
const updateDocumentUseCase = new UpdateDocumentUseCase(
  timeProvider,
  documentRepository,
  documentMapper,
);
const chatDocUseCase = new ChatDocUseCase(
  timeProvider,
  documentRepository,
  openAiAdaptter,
  slasticSearchIndexer,
);
const searchTermUseCase = new SearchTermUseCase(
  timeProvider,
  documentRepository,
  slasticSearchIndexer,
  elasticSearchConfig.indexName,
);
const getDocSuggestionsUseCase = new GetDocumentSuggestionsUseCase(
  timeProvider,
  openAiAdaptter,
);

container.registerInstance<ICreateDocumentUseCase>(
  "ICreateDocumentUseCase",
  createDocumentUseCase,
);
container.registerInstance<IDeleteDocumentUseCase>(
  "IDeleteDocumentUseCase",
  deleteDocumentUseCase,
);
container.registerInstance<IGetAllDocumentUseCase>(
  "IGetAllDocumentUseCase",
  getAllDocumentUseCase,
);
container.registerInstance<IGetDocumentUseCase>(
  "IGetDocumentUseCase",
  getDocumentUseCase,
);

container.registerInstance<IUpdateDocumentUseCase>(
  "IUpdateDocumentUseCase",
  updateDocumentUseCase,
);

container.registerInstance<IGetDocumentSuggestionsUseCase>(
  "IGetDocumentSuggestionsUseCase",
  getDocSuggestionsUseCase,
);

/* Register usecase for searching and chatting */
container.registerInstance<IChatDocUseCase>("IChatDocUseCase", chatDocUseCase);
container.registerInstance<ISearchTermUseCase>(
  "ISearchTermUseCase",
  searchTermUseCase,
);

/* Register usecase check live controller */
const authUserRepository =
  container.resolve<IUserRepository>("IUserRepository");
const authUseCase = new AuthUseCase(
  timeProvider,
  authUserRepository,
  passwordHash,
);
container.registerInstance<IAuthUseCase>("IAuthUseCase", authUseCase);

/* Register usecase for authentication */
const liveUseCase = new LiveUseCase();
container.registerInstance<ILiveUseCase>("ILiveUseCase", liveUseCase);

/* Register all controllers for user */
container.register("CreateUserController", { useClass: CreateUserController });
container.register("GetUserController", { useClass: GetUserController });
container.register("UpdateUserController", { useClass: UpdateUserController });

/* Register all controllers for document */
container.register("GetDocumentController", {
  useClass: GetDocumentController,
});
container.register("GetAllDocumentController", {
  useClass: GetAllDocumentController,
});
container.register("CreateDocumentController", {
  useClass: CreateDocumentController,
});
container.register("UpdateDocumentController", {
  useClass: UpdateDocumentController,
});
container.register("DeleteDocumentController", {
  useClass: DeleteDocumentController,
});

/* Register authentication controller */
container.register("AuthController", { useClass: AuthController });

/* Register check live controller */
container.register("LiveController", { useClass: AuthController });

/* Register search  term controller*/
container.register("SearchTermController", { useClass: SearchTermController });

/* Register chat with document controller */
container.register("ChatDocController", { useClass: ChatDocController });

/* Register get document controller */
container.register("GetDocController", { useClass: ChatDocController });

/* Register get document suggestions controller */
container.register("GetDocSuggestionsController", {
  useClass: GetDocSuggestionsController,
});
