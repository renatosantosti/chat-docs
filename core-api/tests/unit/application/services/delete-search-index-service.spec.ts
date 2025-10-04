import { DeleteSearchIndexService } from "@/application/services/delete-search-index-service";
import { IIndexerAdapter } from "@/application/interfaces/adapters/indexer-adapter";

describe("DeleteSearchIndexService", () => {
  let mockIndexerAdapter: jest.Mocked<IIndexerAdapter>;
  let service: DeleteSearchIndexService;
  const mockIndexName = "test-index";

  beforeEach(() => {
    mockIndexerAdapter = {
      searchByTerm: jest.fn(),
      searchBySemantic: jest.fn(),
      indexContent: jest.fn(),
      deleteDocumentContent: jest.fn(),
    } as jest.Mocked<IIndexerAdapter>;

    service = new DeleteSearchIndexService(mockIndexName, mockIndexerAdapter);
  });

  describe("Constructor", () => {
    it("should correctly assign dependencies", () => {
      // Assert
      expect((service as any).indexName).toBe(mockIndexName);
      expect((service as any).searchIndexer).toBe(mockIndexerAdapter);
    });
  });

  describe("execute", () => {
    const testDocumentId = "123";

    it("should successfully delete document content from search index", async () => {
      // Arrange
      mockIndexerAdapter.deleteDocumentContent.mockResolvedValueOnce(true);

      // Act
      const result = await service.execute(testDocumentId);

      // Assert
      expect(result).toBe(true);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        testDocumentId,
      );
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledTimes(1);
    });

    it("should return false when indexer adapter fails to delete", async () => {
      // Arrange
      mockIndexerAdapter.deleteDocumentContent.mockResolvedValueOnce(false);

      // Act
      const result = await service.execute(testDocumentId);

      // Assert
      expect(result).toBe(false);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        testDocumentId,
      );
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledTimes(1);
    });

    it("should return false and handle exceptions when indexer adapter throws error", async () => {
      // Arrange
      const mockError = new Error("ElasticSearch connection failed");
      mockIndexerAdapter.deleteDocumentContent.mockRejectedValueOnce(mockError);

      // Act
      const result = await service.execute(testDocumentId);

      // Assert
      expect(result).toBe(false);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        testDocumentId,
      );
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledTimes(1);
    });

    it("should handle empty document ID", async () => {
      // Arrange
      const emptyDocumentId = "";
      mockIndexerAdapter.deleteDocumentContent.mockResolvedValueOnce(true);

      // Act
      const result = await service.execute(emptyDocumentId);

      // Assert
      expect(result).toBe(true);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        emptyDocumentId,
      );
    });

    it("should handle null document ID", async () => {
      // Arrange
      const nullDocumentId = null as unknown as string;
      mockIndexerAdapter.deleteDocumentContent.mockResolvedValueOnce(true);

      // Act
      const result = await service.execute(nullDocumentId);

      // Assert
      expect(result).toBe(true);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        nullDocumentId,
      );
    });

    it("should handle undefined document ID", async () => {
      // Arrange
      const undefinedDocumentId = undefined as unknown as string;
      mockIndexerAdapter.deleteDocumentContent.mockResolvedValueOnce(true);

      // Act
      const result = await service.execute(undefinedDocumentId);

      // Assert
      expect(result).toBe(true);
      expect(mockIndexerAdapter.deleteDocumentContent).toHaveBeenCalledWith(
        mockIndexName,
        undefinedDocumentId,
      );
    });
  });
});
