import { BigString, Bot } from "discord";
import { ISendMessageSchedule } from "./ISchedule.ts";

/**
 * メッセージ送信スケジュールの抽象クラス
 * 初期化時にガードを実施する
 */
export default abstract class AbstructSendMessageSchedule
  implements ISendMessageSchedule {
  public readonly bot: Bot;
  public readonly channelId: BigString;
  abstract regist(): void;
  abstract send(): Promise<void>;

  constructor(bot: Readonly<Bot>, channelId: BigString) {
    this.bot = bot;
    this.channelId = channelId;
  }
}
