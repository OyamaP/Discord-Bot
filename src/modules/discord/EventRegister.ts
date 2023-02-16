import MorningEvent from "./events/MorningEvent.js";
import StampEvent from "./events/StampEvent.js";
import { Message } from "discord.js";

// 配列の上から順に優先度の高いイベントを設定する
const EventArray = [new StampEvent(), new MorningEvent()];

export default class EventRegister {
  /**
   * 条件に合致するイベントを全て実行する
   * @param message
   */
  public startEvents(message: Message): void {
    EventArray.forEach((event) => {
      if (event.isTargetEvent(message)) event.startEvent(message);
    });
  }

  /**
   * 条件の合致した優先度の高いイベントを1つ実行する
   * @param message
   */
  public startPrioritizedEvent(message: Message): void {
    const targetEvent = EventArray.find((event) =>
      event.isTargetEvent(message)
    );
    if (targetEvent !== undefined) targetEvent.startEvent(message);
  }
}
