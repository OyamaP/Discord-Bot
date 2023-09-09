import { Bot, Message } from "discord";
import { Payload } from "../type.ts";
import { IChannelType } from "./IChannelType.ts";
import { toSplitArray } from "./toSplitArray.ts";

const { DISCORD_PREMIUM_CHANNEL_ID } = Deno.env.toObject();

export default class PremiumChannelType implements IChannelType {
  public isTarget(channelId: string): boolean {
    if (DISCORD_PREMIUM_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_PREMIUM_CHANNEL_ID);

    return channelIds.includes(channelId);
  }

  public launchReadyEvent(
    _bot: Readonly<Bot>,
    _payload: Readonly<Payload>,
  ): void {
    // 設定無し
  }

  public launchMessageEvent(
    _bot: Readonly<Bot>,
    _message: Readonly<Message>,
  ): void {
    // 設定なし
  }
}
