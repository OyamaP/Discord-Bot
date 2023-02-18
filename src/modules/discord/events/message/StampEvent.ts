import EventInterface from "./EventInterface.js";
import { Message } from "discord.js";
import DropboxManager from "../../../dropbox/Manager.js";

/**
 * Discord スタンプ(絵文字)利用された場合のイベント
 */
export default class StampEvent implements EventInterface {
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
      const dbx = new DropboxManager();
      const imageLinks = await dbx.fetchFileLinks(stampName);
      if (!imageLinks.length) return;

      // Discord で利用されたメッセージ絵文字を削除する
      await message.delete().catch(() => {
        throw new Error("Failed delete message.");
      });

      // Discord にスタンプ画像を送信する
      const userName = message.member?.nickname || message.author.username;
      message.channel.send({
        embeds: imageLinks.map((imageLink) => {
          return {
            description: `***used stamp by ${userName}***`,
            image: { url: imageLink },
          };
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * メッセージからスタンプ名を抽出する
   * @param message メッセージ
   * @returns スタンプ名
   */
  public toStampName(message: Message): string {
    const match = message.content.match(/:(.+):/);
    if (match === null)
      throw new Error(`Failed match stamp name. => ${message.content}`);
    return match[0].replaceAll(":", "");
  }
}
