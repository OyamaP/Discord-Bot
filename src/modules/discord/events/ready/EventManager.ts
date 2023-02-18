import Schedule from "./Schedule.js";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_CHANNEL_ID } = process.env;

const schedule = new Schedule();

/**
 * メッセージを起因とするイベントを管理する
 */
export default class EventManager {
  /**
   * Readyイベントを登録する
   * @param client
   */
  public registReadyEvent(client: Client): void {
    if (client.user) console.log(`Logged in as ${client.user.tag}!`);
    if (DISCORD_CHANNEL_ID === undefined) return;
    // カンマ区切りのチャンネルID文字列を配列に変更
    const channelIds = DISCORD_CHANNEL_ID.replaceAll(" ", "").split(",");

    // チャンネルIDごとにスケジュールを登録
    schedule.register(client, channelIds);
  }
}
