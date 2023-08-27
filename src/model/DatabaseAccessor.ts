import "env";
import { MongoClient } from "mongo";
import { StampLogModel } from "./StampLogModel.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") || "";
const MONGO_DB_NAME = Deno.env.get("MONGO_DB_NAME") || "";

/**
 * データベースアクセス用クラス
 *
 * 本クラスはDBとのアクセスを行う度に初期化をすること
 * ```typescript
 * const dbAccessor = await DatabaseAccessor.connect();
 * ```
 * client.connect()して数分放置すると、接続がリセットされていてエラーとなってしまう
 * ```bash
 * Uncaught ConnectionReset: Connection reset by peer (os error 104)
 * ```
 */
export default class DatabaseAccessor {
  public readonly client: MongoClient;
  public readonly StampLog: StampLogModel;

  private constructor(client: MongoClient) {
    this.client = client;
    this.StampLog = new StampLogModel(client, MONGO_DB_NAME);
  }

  static async connect(): Promise<DatabaseAccessor> {
    try {
      const client = new MongoClient();
      await client.connect(MONGO_URI);

      return new this(client);
    } catch (e: any) {
      console.error(e);
      throw new Error("DBとの接続に失敗しました");
    }
  }
}
