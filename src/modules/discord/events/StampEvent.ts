import EventInterface from "./EventInterface.js";
import { Message } from "discord.js";
import DropboxManager from "../../dropbox/Manager.js";

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
  public startEvent = async (message: Message): Promise<void> => {
    const stampName = this.toStampName(message);
    const dbx = new DropboxManager();
    const links = await dbx.fetchFileLinks(stampName);
    const userName = message.member?.nickname || message.author.username;

    // message.delete();
    message.channel.send({
      embeds: links.map((link) => {
        return {
          description: `***used stamp by ${userName}***`,
          image: { url: link },
        };
      }),
    });
  };

  /**
   * メッセージからスタンプ名を抽出する
   * @param message メッセージ
   * @returns スタンプ名
   */
  public toStampName(message: Message): string {
    const match = message.content.match(/:(.+):/);
    if (match === null) throw new Error();
    return match[0].replaceAll(":", "");
  }
}
