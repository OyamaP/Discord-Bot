import Schedule from "./Schedule.js";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_CHANNEL_ID } = process.env;

/**
 * メッセージを起因とするイベントを管理する
 */
export default class EventLauncher {
  /**
   * Discord イベント起動初期化
   * @param client
   */
  public init(client: Client): void {
    if (client.user) console.log(`Logged in as ${client.user.tag}!`);
    if (DISCORD_CHANNEL_ID === undefined) return;
    // カンマ区切りのチャンネルID文字列を配列に変更
    const channelIds = DISCORD_CHANNEL_ID.replaceAll(" ", "").split(",");

    // チャンネルIDごとにスケジュールを登録
    new Schedule().register(client, channelIds);
  }
}
