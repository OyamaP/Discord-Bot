import { Client, Message } from "discord.js";
import { IChannelGroupType } from "./IChannelGroupType.js";
import { ISchedule } from "../schedule/ISchedule.js";
import SendMessageAtHolidayNoon from "../schedule/SendMessageAtHolidayNoon.js";
import { toSplitArray } from "./toSplitArray.js";
import MorningEvent from "../event/message/MorningEvent.js";
import StampEvent from "../event/message/StampEvent.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_DEVELOP_CHANNEL_ID } = process.env;

// 配列の上から順に優先度の高いイベントを実行する
// クラスや関数内で初期化すると状態管理ができなくなるため外で初期化
const EventArray = [new StampEvent(), new MorningEvent()];

export default class DevelopChannelType implements IChannelGroupType {
  readonly channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;
  }

  public isTarget(): boolean {
    if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);

    return channelIds.includes(this.channelId);
  }

  public launchReadyEvent(client: Client): void {
    // if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return;
    // const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);
    // channelIds.forEach((channelId) => {
    //   const schedules: ISchedule[] = [
    //     new SendMessageAtHolidayNoon(client, channelId),
    //   ];
    //   schedules.forEach((schedule) => schedule.regist());
    // });
  }

  public launchMessageEvent(message: Message<boolean>): void {
    const targetEvent = EventArray.find((event) =>
      event.isTargetEvent(message)
    );
    if (targetEvent === undefined) return;
    targetEvent.launchEvent(message, this.channelId);
  }
}
