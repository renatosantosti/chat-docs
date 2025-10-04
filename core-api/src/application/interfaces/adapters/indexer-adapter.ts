import {
  IndexedDocumentDto,
  SearchEmbeddedDocumentDto,
  SearchTermDto,
  SearchResultDto,
} from "@/domain/dtos/search-dtos";

export interface IIndexerAdapter {
  /**
   * Performs a term-based search using the provided filter.
   * @param indexName - The index name
   * @param filter - An object containing the search criteria.
   * @returns A promise resolving to an array of matching documents.
   */
  searchByTerm(
    indexName: string,
    filter: SearchTermDto,
  ): Promise<SearchResultDto[]>;

  /**
   * Performs a semantic search using the provided filter and query embedding.
   * @param indexName - The index name
   * @param filter - An object containing the search criteria.
   * @returns A promise resolving to an array of semantically matching documents.
   */
  searchBySemantic(
    indexName: string,
    filter: SearchEmbeddedDocumentDto,
  ): Promise<SearchResultDto[]>;

  /**
   * Indexes a single page of a document into Elasticsearch.
   * @param indexName - The index name
   * @param page - An object representing the page content and metadata.
   * @returns A promise resolving when the indexing operation is complete.
   */
  indexContent(indexName: string, page: IndexedDocumentDto): Promise<void>;

  /**
   * Deletes all indexed content for a specific document from Elasticsearch.
   * @param indexName - The index name
   * @param documentId - The ID of the document to delete from the index
   * @returns A promise resolving to true if deletion was successful, false otherwise
   */
  deleteDocumentContent(
    indexName: string,
    documentId: string,
  ): Promise<boolean>;
}
