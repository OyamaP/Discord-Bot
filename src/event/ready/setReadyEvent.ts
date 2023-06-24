import { Client } from "discord.js";
import { getChannelTypes } from "../../detector/channelType.js";

/**
 * メッセージを起因とするイベントを設定する
 */
export function setReadyEvent(client: Client): void {
  if (client.user) console.log(`Logged in as ${client.user.tag}!`);

  const channelTypes = getChannelTypes();
  channelTypes.forEach((channelType) => channelType.launchReadyEvent(client));
}
