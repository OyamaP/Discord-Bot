import { Message } from "discord.js";
import DropboxManager from "../dropbox/Manager.js";

/**
 * Discord スタンプ(絵文字)利用された場合のイベント
 */
export default class StampEvent {
  /**
   * メッセージがスタンプであるかを判定する
   * @param message メッセージ
   * @returns スタンプ判定
   */
  static isStampMessage(message: Message): boolean {
    return /^<:(.+):(.+)>$/.test(message.content);
  }

  /**
   * メッセージからスタンプ名を抽出する
   * @param message メッセージ
   * @returns スタンプ名
   */
  static toStampName(message: Message): string {
    const match = message.content.match(/:(.+):/);
    if (match === null) throw new Error();
    return match[0].replaceAll(":", "");
  }

  static startStampBot = async (message: Message): Promise<void> => {
    const stampName = this.toStampName(message);
    const runningMessage = await message.channel.send("Running Stamp Bot...");
    const dbx = new DropboxManager();
    const links = await dbx.fetchFileLinks(stampName);
    const userName = message.member?.nickname || message.author.username;

    runningMessage.delete();
    message.delete();
    message.channel.send({
      embeds: links.map((link) => {
        return {
          description: `***used stamp by ${userName}***`,
          image: { url: link },
        };
      }),
    });
  };
}
