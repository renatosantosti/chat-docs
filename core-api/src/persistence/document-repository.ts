import IDocumentRepository from "@/application/interfaces/repositories/document";
import DbContext from "@/infrastructure/database/sequelize";
import Document from "@/domain/models/document";
import DocumentEntity from "@/infrastructure/database/entities/document";
import IBaseMapper from "@/application/interfaces/base/base-mapper";

export default class DocumentRepository implements IDocumentRepository {
  constructor(
    readonly mapper: IBaseMapper<Document, Partial<DocumentEntity>>,
  ) {}

  async deleteOneById(id: number): Promise<boolean> {
    const doc = await DbContext.Documents.destroy({ where: { id: id } });
    return doc > 0;
  }

  async getAll(filter: any | null = null): Promise<Document[] | null> {
    const whereClause = filter || { isActive: true };
    const result = await DbContext.Documents.findAll({ where: whereClause });
    return this.mapper.mapArrayReverse(result);
  }

  async getAllByUserId(userId: number): Promise<Document[]> {
    const result = await DbContext.Documents.findAll({ where: { userId } });
    return this.mapper.mapArrayReverse(result);
  }

  async createOne(document: Document): Promise<Document | null> {
    let result: DocumentEntity;
    const transaction = await DbContext.dbConnection.transaction();
    try {
      result = await DbContext.Documents.create(
        document as Omit<Document, "pages">,
        { transaction },
      );
      const pageNumber = 1;
      const pages = document.pages.map((page) => {
        page.documentId = result.id;
        return page;
      });

      await DbContext.Pages.bulkCreate(pages, { transaction });
      transaction.commit();
      return result ? this.mapper.mapReverse(result) : null;
    } catch (error) {
      transaction.rollback();
      console.error("Error to save document and pages.", { Details: error });
      throw new Error("Error to save document and pages.");
    }
  }

  async getOneById(documentId: number): Promise<Document | null> {
    console.log(
      "DocumentRepository.getOneById - Searching for document ID:",
      documentId,
    );
    const result = await DbContext.Documents.findOne({
      where: { id: documentId, isActive: true },
    });
    console.log(
      "DocumentRepository.getOneById - Found document:",
      result ? "Yes" : "No",
    );
    if (result) {
      console.log("DocumentRepository.getOneById - Document details:", {
        id: result.id,
        title: result.title,
        userId: result.userId,
        isActive: result.isActive,
      });
    }
    return result ? this.mapper.mapReverse(result) : null;
  }

  async updateOne(document: Document): Promise<Document | null> {
    const [affectedRows] = await DbContext.Documents.update(
      document as Omit<Document, "pages">,
      { where: { id: document.id } },
    );
    return affectedRows > 0 ? document : null;
  }
}
