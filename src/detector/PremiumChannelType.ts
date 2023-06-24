import { Client, Message } from "discord.js";
import { IChannelType } from "./IChannelType.js";
import { toSplitArray } from "./toSplitArray.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_PREMIUM_CHANNEL_ID } = process.env;

export default class PremiumChannelType implements IChannelType {
  public isTarget(channelId: string): boolean {
    if (DISCORD_PREMIUM_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_PREMIUM_CHANNEL_ID);

    return channelIds.includes(channelId);
  }

  public launchReadyEvent(client: Client): void {
    // 設定無し
  }

  public launchMessageEvent(message: Message<boolean>): void {
    // 設定なし
  }
}
