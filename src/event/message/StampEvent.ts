import { Bot, DiscordEmbedAuthor, Message } from "discord";
import IMessageEvent from "./IMessageEvent.ts";
import fetchFileLinks from "../../storage/fetchFileLinks.ts";
import { sendImageToChannel } from "../../send/sendImageToChannel.ts";
import DatabaseClient from "../../model/DatabaseClient.ts";

// メッセージを検知する度にStampEventクラスが初期化される
// DatabaseClientクラスの多重初期化を避けるためStampEventクラス外で初期化
const client = new DatabaseClient();

/**
 * Discord スタンプ(絵文字)利用された場合のイベント
 */
export default class StampEvent implements IMessageEvent {
  /**
   * メッセージがスタンプであるかを判定する
   * @param message メッセージ
   * @returns スタンプ判定
   */
  public isTargetEvent(message: Readonly<Message>): boolean {
    return /^<:(.+):(.+)>$/.test(message.content);
  }

  public async launchEvent(
    bot: Readonly<Bot>,
    message: Readonly<Message>,
  ): Promise<void> {
    try {
      // Dropbox からスタンプ画像のリンクを取得してくる
      const stampName = this.toStampName(message);
      const imageLinks = await fetchFileLinks(stampName, `/${message.guildId}`);
      if (imageLinks.length === 0) {
        throw new Error(`Failed get file links. => ${stampName}`);
      }

      // Discord で利用されたメッセージ絵文字を削除する
      await bot.helpers.deleteMessage(message.channelId, message.id);

      // Discord にスタンプ画像を送信
      const author = await this.toEmbedAuthor(bot, message);
      await sendImageToChannel(bot, message.channelId, imageLinks, { author });

      const user = await bot.helpers.getUser(message.authorId);

      // 結果をDBに保存する
      await client.StorageStampLog.insertRecord({
        channelId: String(message.channelId),
        guildId: String(message.guildId),
        messageId: String(message.id),
        userId: String(message.authorId),
        userName: user.username,
        stampName,
      });
    } catch (e: any) {
      console.error(e);
    }
  }

  /**
   * メッセージからスタンプ名を抽出する
   * @param message メッセージ
   * @returns スタンプ名
   */
  private toStampName(message: Readonly<Message>): string {
    const match = message.content.match(/:(.+):/);
    if (match === null) {
      throw new Error(`Failed match stamp name. => ${message.content}`);
    }
    return match[0].replaceAll(":", "");
  }

  /**
   * メッセージ送信時のユーザーアイコンと名前を設定する
   * @param message
   * @returns
   */
  private async toEmbedAuthor(
    bot: Readonly<Bot>,
    message: Readonly<Message>,
  ): Promise<DiscordEmbedAuthor> {
    const user = await bot.helpers.getUser(message.authorId);
    const name = message.member?.nick || user.username;
    const icon = await this.fetchAvatarURL(bot, message);

    return { name, icon_url: icon };
  }

  private async fetchAvatarURL(
    bot: Readonly<Bot>,
    message: Readonly<Message>,
  ): Promise<string> {
    const user = await bot.helpers.getUser(message.authorId);
    const avatarURL = await bot.helpers.getAvatarURL(
      message.authorId,
      user.discriminator,
      { avatar: user.avatar },
    );

    return avatarURL;
  }
}
