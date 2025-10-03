import { Client } from "@elastic/elasticsearch";
import { IIndexerAdapter } from "@/application/interfaces/adapters/indexer-adapter";
import {
  IndexedDocumentDto,
  SearchTermDto,
  SearchResultDto,
  SearchEmbeddedDocumentDto,
} from "@/domain/dtos/search-dtos";

export class SlasticSearchIndexer implements IIndexerAdapter {
  private client: Client;
  private embeddingDims: number;

  constructor(
    host: string,
    port: number,
    apiKey?: string,
    user?: string,
    password?: string,
    embeddingDims: number = 1536,
  ) {
    let conf: any = {
      node: `${host}:${port}`,
    };

    // Priority: apiKey > user/password
    if (apiKey && apiKey.trim() !== "") {
      conf.auth = {
        apiKey: apiKey,
      };
    } else if (
      user &&
      password &&
      user.trim() !== "" &&
      password.trim() !== ""
    ) {
      conf.auth = {
        username: user,
        password: password,
      };
    }

    try {
      this.client = new Client({ ...conf });
      this.embeddingDims = embeddingDims;
    } catch (error) {
      console.error("Erro to connect on Indexer provider. Details:", {
        error,
      });
      throw new Error("Erro to connect on Indexer provider!");
    }
  }

  /**
   * Performs a term-based search using the provided filter.
   * @param indexName - The index name
   * @param filter - An object containing the search criteria.
   * @returns A promise resolving to an array of matching documents.
   */
  async searchByTerm(
    indexName: string,
    filter: SearchTermDto,
  ): Promise<SearchResultDto[]> {
    const query: any = {
      bool: {
        must: [
          {
            wildcard: {
              content: {
                value: `*${filter.term}*`, // Use wildcard to match the term within words
                case_insensitive: true,
              },
            },
          },
        ],
        ...(!!filter.documentId && {
          filter: [
            {
              term: {
                documentId: filter.documentId,
              },
            },
          ],
        }),
      },
    };

    const highlight: any = {
      fields: {
        content: {
          fragment_size: 350, // Limit the size of the highlighted fragment
          number_of_fragments: 3,
          pre_tags: [""], // Highlight start tag
          post_tags: [""], // Highlight end tag
        },
      },
    };

    const response = await this.client.search({
      index: indexName,
      query: query,
      highlight: highlight,
    });

    return response.hits.hits.map((hit: any) => {
      const { documentId, documentName, pageNumber, content } = {
        ...hit._source,
        content: (hit.highlight?.content || []).join(" "),
      };

      return { documentId, documentName, pageNumber, content };
    });
  }

  /**
   * Performs a semantic search using the provided filter and query embedding.
   * @param indexName - The index name
   * @param filter - An object containing the search criteria.
   * @returns A promise resolving to an array of semantically matching documents.
   */
  async searchBySemantic(
    indexName: string,
    filter: SearchEmbeddedDocumentDto,
  ): Promise<SearchResultDto[]> {
    const response = await this.client.search({
      index: indexName,
      query: {
        bool: {
          filter: [
            {
              term: {
                documentId: filter.documentId,
              },
            },
            {
              script_score: {
                query: {
                  match_all: {},
                },
                script: {
                  source:
                    "cosineSimilarity(params.query_vector, doc['embedding']) + 1.0",
                  params: {
                    query_vector: filter.embedding,
                  },
                },
              },
            },
          ],
        },
      },
    });
    return response.hits.hits.map((hit: any) => hit._source);
  }

  /**
   * Indexes a single page of a document into Elasticsearch.
   * @param indexName - The index name
   * @param document - An object representing the page content and metadata.
   * @returns A promise resolving when the indexing operation is complete.
   */
  async indexContent(
    indexName: string,
    document: IndexedDocumentDto,
  ): Promise<void> {
    //First of all check if index exists
    const exists = await this.client.indices.exists({ index: indexName });
    if (!exists) {
      console.log(`The index not exists yet: ${indexName}.`);
      await this.createIndexWithMapping(indexName, this.embeddingDims);
    }

    //Then try to go ahead
    const result = await this.client.index({
      index: indexName,
      body: document,
    });
  }

  async createIndexWithMapping(indexName: string, embeddingDims: number) {
    const mapping = {
      mappings: {
        properties: {
          documentId: { type: "integer" },
          documentName: { type: "text" },
          pageNumber: { type: "integer" },
          content: { type: "text" },
          embedding: {
            type: "dense_vector",
            dims: embeddingDims,
          },
        },
      },
    };

    try {
      await this.client.indices.create({
        index: indexName,
        body: mapping,
      } as any);
    } catch (error) {
      console.error("Error creating index:", error);
    }
  }
}
