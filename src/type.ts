import { User } from "discord";

/**
 * discordeno のreadyイベント第2引数のオブジェクト
 * 型として定義されておらず、オブジェクト全体を引数として利用したいため定義
 */
export interface Payload {
  shardId: number;
  v: number;
  user: User;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
}
