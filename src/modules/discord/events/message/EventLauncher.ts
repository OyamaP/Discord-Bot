import MorningEvent from "./MorningEvent.js";
import StampEvent from "./StampEvent.js";
import { Message } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { ENV } = process.env;

// 配列の上から順に優先度の高いイベントを設定する
const EventArray = [new StampEvent(), new MorningEvent()];

/**
 * メッセージを起因とするイベントを管理する
 */
export default class EventLauncher {
  /**
   * Discord イベント起動初期化
   * @param message メッセージ
   */
  public init = async (message: Message): Promise<void> => {
    if (message.author.bot) return;
    if (ENV === "local") console.log(message);
    this.launchPrioritizedEvent(message);
  };

  /**
   * 条件の合致した優先度の高いイベントを1つ実行する
   * @param message
   */
  private async launchPrioritizedEvent(message: Message): Promise<void> {
    const targetEvent = EventArray.find((event) =>
      event.isTargetEvent(message)
    );
    if (targetEvent !== undefined) targetEvent.launchEvent(message);
  }
}
