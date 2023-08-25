import { Message } from 'discord.js';

/**
 * メッセージイベントを定義する際はこのインターフェイスを利用して登録する
 */
export default interface IMessageEvent {
  /**
   * メッセージが該当ターゲットのイベントであるかを判定
   * @param message
   */
  isTargetEvent(message: Readonly<Message>): boolean;

  /**
   * イベント処理を開始する
   * @param message
   */
  launchEvent(message: Readonly<Message>): Promise<void>;
}
