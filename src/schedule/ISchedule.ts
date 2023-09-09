import { BigString, Bot } from "discord";

export interface ISchedule {
  // deno-lint-ignore no-explicit-any
  regist(...any: any): void;
}

export interface ISendMessageSchedule extends ISchedule {
  readonly bot: Bot;
  readonly channelId: BigString;
  /**
   * スケジュールを登録する
   */
  regist(): void;

  /**
   * メッセージを送信する
   */
  send(): Promise<void>;
}
