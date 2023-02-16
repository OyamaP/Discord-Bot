import EventInterface from "./EventInterface.js";
import { Message } from "discord.js";
import DropboxManager from "../../dropbox/Manager.js";

/**
 * 朝の特定時間に誰かが発言した際に発生するイベント
 */
export default class MorningEvent implements EventInterface {
  /**
   * メッセージ投稿時が6~8時かを判定する
   * @returns 朝判定
   */
  public isTargetEvent(): boolean {
    const date = new Date();
    const hour = date.getHours();
    const morningTimes = [6, 8];
    return false;
    // return morningTimes.includes(hour);
  }

  public async startEvent(message: Message<boolean>): Promise<void> {
    const stampName = "hsn_huton"; // 布団の画像
    if (!this.isRandomBoolean(0.5)) return;
    const dbx = new DropboxManager();
    const links = await dbx.fetchFileLinks(stampName);
    message.channel.send({
      embeds: links.map((link) => {
        return {
          image: { url: link },
        };
      }),
    });
  }

  /**
   * 引数の値より生成ランダム値が高いかを判定する
   * @param value 小数点を含む0 ~ 1の値
   * @returns
   */
  private isRandomBoolean(value: number): boolean {
    return Math.random() > value;
  }
}
