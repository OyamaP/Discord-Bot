import IMessageEvent from "./IMessageEvent.js";
import { fetchFileLinks } from "../../utils/fetchFileLinks.js";
import { sendImageToChannel } from "../../utils/sendImageToChannel.js";
import { Message, APIEmbedAuthor } from "discord.js";

/**
 * Discord スタンプ(絵文字)利用された場合のイベント
 */
export default class StampEvent implements IMessageEvent {
  /**
   * メッセージがスタンプであるかを判定する
   * @param message メッセージ
   * @returns スタンプ判定
   */
  public isTargetEvent(message: Message): boolean {
    return /^<:(.+):(.+)>$/.test(message.content);
  }

  /**
   * スタンプイベントを開始する
   * @param message メッセージ
   */
  public async launchEvent(message: Message): Promise<void> {
    try {
      // Dropbox からスタンプ画像のリンクを取得してくる
      const stampName = this.toStampName(message);
      const imageLinks = await fetchFileLinks(stampName);
      if (imageLinks === null) return;

      // Discord で利用されたメッセージ絵文字を削除する
      await message.delete().catch(() => {
        throw new Error("Failed delete message.");
      });

      // Discord にスタンプ画像を送信
      sendImageToChannel(imageLinks, message.channel, {
        author: this.toAutorEmbed(message),
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
  private toStampName(message: Message): string {
    const match = message.content.match(/:(.+):/);
    if (match === null)
      throw new Error(`Failed match stamp name. => ${message.content}`);
    return match[0].replaceAll(":", "");
  }

  /**
   * メッセージ送信時のユーザーアイコンと名前を設定する
   * @param message
   * @returns
   */
  private toAutorEmbed(message: Message): APIEmbedAuthor {
    const discordAppIconUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
    const userName = message.member?.nickname || message.author.username;
    const userIcon = message.author.avatarURL() || discordAppIconUrl;
    return {
      name: userName,
      icon_url: userIcon,
    };
  }
}
