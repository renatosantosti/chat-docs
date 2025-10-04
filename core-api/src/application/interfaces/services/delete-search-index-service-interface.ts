import IBaseService from "@/application/interfaces/base/base-service";

export interface IDeleteSearchIndexService
  extends IBaseService<string, Promise<boolean>> {
  execute(documentId: string): Promise<boolean>;
}
