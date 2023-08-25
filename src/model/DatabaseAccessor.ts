import "env";
import { MongoClient } from "mongo";
import { StampLogModel } from "./StampLog.ts";

const client = new MongoClient();
const MONGO_URI = Deno.env.get("MONGO_URI") || "";
const MONGO_DB_NAME = Deno.env.get("MONGO_DB_NAME") || "";

try {
  await client.connect(MONGO_URI);
} catch (e: any) {
  console.error(e);
  throw new Error("DBとの接続に失敗しました");
}

const Model = {
  StampLog: new StampLogModel(client, MONGO_DB_NAME)
};

export default Model;
