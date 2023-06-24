import { SendingExecutableChannel } from '../send/sendImageToChannel.js';

export interface ISchedule {
  regist(...any: any): void;
}

export interface ISendMessageSchedule extends ISchedule {
  /**
   * send()実行可能なチャンネル
   */
  readonly channel: SendingExecutableChannel;

  /**
   * チャンネルID
   */
  readonly channelId: string;

  /**
   * スケジュールを登録する
   */
  regist(): void;

  /**
   * メッセージを送信する
   */
  send(): Promise<void>;
}
