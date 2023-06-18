import { Client } from "discord.js";
import { ISendMessageSchedule } from "./ISchedule.js";
import {
  SendingExecutableChannel,
  isSendingExecutableChannel,
} from "../send/sendImageToChannel.js";

/**
 * メッセージ送信スケジュールの抽象クラス
 * 初期化時にガードを実施する
 */
export default abstract class AbstructSendMessageSchedule
  implements ISendMessageSchedule
{
  public readonly channel: SendingExecutableChannel;
  public readonly channelId: string;
  abstract regist(): void;
  abstract send(): Promise<void>;

  constructor(client: Client, channelId: string) {
    const channel = client.channels.cache.get(channelId);
    if (channel === undefined) {
      throw new Error(`${channelId}のチャンネルIDは見つかりませんでした`);
    }
    if (!isSendingExecutableChannel(channel)) {
      throw new Error(`${channel.id}のチャンネルIDには送信できません`);
    }

    this.channel = channel;
    this.channelId = channelId;
  }
}
