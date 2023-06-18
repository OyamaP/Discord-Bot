import { Client } from "discord.js";
import { getChannelTypes } from "../../detector/initChannelType.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_CHANNEL_ID } = process.env;

/**
 * メッセージを起因とするイベントを設定する
 */
export function setReadyEvent(client: Client): void {
  if (client.user) console.log(`Logged in as ${client.user.tag}!`);
  if (DISCORD_CHANNEL_ID === undefined) return;

  const channelTypes = getChannelTypes();
  channelTypes.forEach((channelType) => channelType.launchReadyEvent(client));
}
