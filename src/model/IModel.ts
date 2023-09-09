import { Collection, ObjectId } from "mongo";

export interface IModel {
  readonly collectionName: string
  readonly collection: Collection<any>

  insertRecord(record: any): Promise<ObjectId>
}
