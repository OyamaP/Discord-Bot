import { Message } from "discord.js";
import { IChannelGroupType } from "./IChannelGroupType.js";
import { toSplitArray } from "./toSplitArray.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_PREMIUM_CHANNEL_ID } = process.env;

export default class PremiumChannelType implements IChannelGroupType {
  readonly channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;
  }

  public isTarget(): boolean {
    if (DISCORD_PREMIUM_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_PREMIUM_CHANNEL_ID);

    return channelIds.includes(this.channelId);
  }

  public launchReadyEvent(): void {
    // 設定無し
  }

  public launchMessageEvent(message: Message<boolean>): void {
    // 設定なし
  }
}
