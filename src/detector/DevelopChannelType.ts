import { Bot, Message } from "discord";
import { IChannelType } from "./IChannelType.ts";
import { ISchedule } from "../schedule/ISchedule.ts";
import SendMessageAtHolidayNoon from "../schedule/SendMessageAtHolidayNoon.ts";
import { toSplitArray } from "./toSplitArray.ts";
import MorningEvent from "../event/message/MorningEvent.ts";
import StampEvent from "../event/message/StampEvent.ts";
import { Payload } from "../type.ts";

const { DISCORD_DEVELOP_CHANNEL_ID } = Deno.env.toObject();

// 配列の上から順に優先度の高いイベントを実行する
// クラスや関数内で初期化すると状態管理ができなくなるため外で初期化
const EventArray = [new StampEvent(), new MorningEvent()];

export default class DevelopChannelType implements IChannelType {
  public isTarget(channelId: string): boolean {
    if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return false;
    const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);

    return channelIds.includes(channelId);
  }

  public launchReadyEvent(
    bot: Readonly<Bot>,
    _payload: Readonly<Payload>,
  ): void {
    if (DISCORD_DEVELOP_CHANNEL_ID === undefined) return;
    const channelIds = toSplitArray(DISCORD_DEVELOP_CHANNEL_ID);
    // 初期化時に失敗するchannelIdがあった場合でも、処理を止めずに設定する
    channelIds.forEach((channelId) => {
      try {
        const schedules: ISchedule[] = [
          new SendMessageAtHolidayNoon(bot, channelId),
        ];
        schedules.forEach((schedule) => schedule.regist());
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  public launchMessageEvent(
    bot: Readonly<Bot>,
    message: Readonly<Message>,
  ): void {
    const targetEvent = EventArray.find((event) =>
      event.isTargetEvent(message)
    );
    if (targetEvent === undefined) return;
    targetEvent.launchEvent(bot, message);
  }
}
