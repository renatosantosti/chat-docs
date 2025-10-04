import { IDeleteSearchIndexService } from "@/application/interfaces/services/delete-search-index-service-interface";
import { IIndexerAdapter } from "@/application/interfaces/adapters/indexer-adapter";

export class DeleteSearchIndexService implements IDeleteSearchIndexService {
  constructor(
    private readonly indexName: string,
    private readonly searchIndexer: IIndexerAdapter,
  ) {}

  async execute(documentId: string): Promise<boolean> {
    try {
      console.log(`Deleting search index for document ID: ${documentId}`);

      const result = await this.searchIndexer.deleteDocumentContent(
        this.indexName,
        documentId,
      );

      if (result) {
        console.log(
          `Successfully deleted search index for document ID: ${documentId}`,
        );
      } else {
        console.error(
          `Failed to delete search index for document ID: ${documentId}`,
        );
      }

      return result;
    } catch (error) {
      console.error("Error in DeleteSearchIndexService:", {
        error,
        documentId,
      });
      return false;
    }
  }
}
