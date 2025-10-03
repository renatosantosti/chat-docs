import {
  OpenAIChatEnumModels,
  OpenAIEmbeddingEnumModels,
} from "@/presentation/helpers/openai-embedding-models";

export type databaseDialect = "sqlite" | "sqliteMemory" | "mysql" | "mssql";

export const authConfig = {
  secret: String(process.env.TOKEN_SECRET),
  saltRounds: Number(process.env.TOKEN_SALT),
  expires: String(process.env.TOKEN_EXPIRES_IN),
};

export const serverConfig = {
  node_env: process.env.NODE_ENV,
  apiPort: process.env.API_PORT ? Number(process.env.API_PORT) : 8000,
  socketPort: process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 9000,
  apiClientHosts: process.env.CLIENT_HOSTS ?? "",
  cookieSecurity: process.env.COOKIE_SECURE === "true",
  cookieSameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as
    | "lax"
    | "strict"
    | "none",
};

export const databaseConfig = {
  dbDialect: (process.env.DB_DIALECT ?? "sqliteMemory") as databaseDialect,
  dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1234,
  dbHost: process.env.DB_HOST ?? "",
  dbName: process.env.DB_NAME ?? "",
  dbUser: process.env.DB_USER ?? "",
  dbPassword: process.env.DB_PASSWORD ?? "",
  addModels: process.env?.ADD_MODELS ?? true,
};
const embeddingModel = (
  !!process.env.OPENAI_EMBEDDING_MODEL
    ? process.env.OPENAI_EMBEDDING_MODEL
    : OpenAIEmbeddingEnumModels.ADA002
) as OpenAIEmbeddingEnumModels;

export const openAiApiConfig = {
  apiKey: process.env.OPENAI_API_KEY ?? "",
  chatModel: process.env.OPENAI_CHAT_MODEL ?? OpenAIChatEnumModels.GPT4Turbo,
  embeddingModel,
  embeddingDims: process.env.OPENAI_EMBEDDING_DIMS
    ? Number(process.env.OPENAI_EMBEDDING_DIMS)
    : 1536,
  maxTokens: process.env.OPENAI_EMBEDDING_MAX_TOKEN
    ? Number(process.env.OPENAI_EMBEDDING_MAX_TOKEN)
    : 1000,
  embeddingModelTemperature: process.env.OPENAI_EMBEDDING_TEMPETURE
    ? Number(process.env.OPENAI_EMBEDDING_TEMPETURE)
    : 0.7,
  chatTemperature: process.env.OPENAI_EMBEDDING_TEMPETURE
    ? Number(process.env.OPENAI_CHAT_TEMPETURE)
    : 0.7,
};

export const elasticSearchConfig = {
  host: process.env.ELASTICSEARCH_HOST ?? "",
  port: process.env.ELASTICSEARCH_PORT
    ? Number(process.env.ELASTICSEARCH_PORT)
    : 9200,
  apiKey: process.env.ELASTICSEARCH_KEY ?? "",
  indexName: process.env.ELASTICSEARCH_INDEX_NAME ?? "",
  user: process.env.ELASTICSEARCH_USER ?? "elastic",
  password: process.env.ELASTICSEARCH_PASSWORD ?? "",
};
