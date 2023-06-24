import { Client, Message } from "discord.js";
import { IChannelType } from "./IChannelType.js";
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

export default class DevelopChannelType implements IChannelType {
  public isTarget(channelId: string): boolean {
    if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);

    return channelIds.includes(channelId);
  }

  public launchReadyEvent(client: Client): void {
    if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return;
    const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);
    // 初期化時に失敗するchannelIdがあった場合でも、処理を止めずに設定する
    channelIds.forEach((channelId) => {
      try {
        const schedules: ISchedule[] = [
          new SendMessageAtHolidayNoon(client, channelId),
        ];
        schedules.forEach((schedule) => schedule.regist());
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  public launchMessageEvent(message: Message<boolean>): void {
    const targetEvent = EventArray.find((event) =>
      event.isTargetEvent(message)
    );
    if (targetEvent === undefined) return;
    targetEvent.launchEvent(message);
  }
}
