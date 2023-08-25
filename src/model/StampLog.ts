import { Collection, MongoClient, ObjectId } from "mongo";
import { IModel } from "./IModel.ts";

export interface StampLogRecord {
  _id: ObjectId;
  channelId: string;
  guildId: string;
  messageId: string;
  userId: string;
  userName: string;
  stampName: string;
  createdAt: Date;
}

export type StampLogInsertParam = Omit<StampLogRecord, "_id" | "createdAt">;

export class StampLogModel implements IModel {
  public readonly collectionName = "stamp_logs";
  public readonly collection: Collection<StampLogRecord>;

  constructor(client: MongoClient, dbName: string) {
    const db = client.database(dbName);
    this.collection = db.collection<StampLogRecord>(this.collectionName);
  }

  public async insertRecord(record: StampLogInsertParam): Promise<ObjectId> {
    try {
      const recordId = await this.collection.insertOne({
        ...record,
        createdAt: new Date(),
      });

      return recordId;
    } catch (e: any) {
      console.error(e);
      throw new Error("レコード追加に失敗しました");
    }
  }
}
