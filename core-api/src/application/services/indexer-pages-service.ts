import {
  DocumentTextPageDto,
  IndexedDocumentDto,
} from "@/domain/dtos/search-dtos";
import { ISearchIndexerService } from "@/application/interfaces/services/semantic-indexer-service-interface";
import { isNotError } from "@/shared/utils/dto-is-error-type-guard ";
import { IGptTextAdapter } from "@/application/interfaces/adapters/gpt-adapter";
import { IIndexerAdapter } from "@/application/interfaces/adapters/indexer-adapter";

export class SearchIndexerService implements ISearchIndexerService {
  constructor(
    private readonly indexName: string,
    private readonly embeddingGenerator: IGptTextAdapter,
    private readonly searchIndexer: IIndexerAdapter,
  ) {}

  async execute(pages: DocumentTextPageDto[]): Promise<boolean> {
    try {
      for (const pageItem of pages) {
        const embedding = await this.embeddingGenerator.getEmbedding(
          pageItem.content,
        );
        const page: IndexedDocumentDto = { ...pageItem, embedding };

        if (isNotError(embedding)) {
          await this.searchIndexer.indexContent(this.indexName, page);
        }
      }
      return true;
    } catch (error) {
      console.error("Error processing document:", { error });
      return false;
    }
  }
}
