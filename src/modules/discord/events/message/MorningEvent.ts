import EventInterface from "./EventInterface.js";
import { Message } from "discord.js";
import DropboxManager from "../../../dropbox/Manager.js";

/**
 * 朝の特定時間に誰かが発言した際に発生するイベント
 */
export default class MorningEvent implements EventInterface {
  private dateNowMsBotTimer: number = 0;

  /**
   * メッセージ投稿時が6~8時かを判定する
   * @returns 朝判定
   */
  public isTargetEvent(): boolean {
    const date = new Date();
    const hour = date.getHours();
    const morningTimes = [6, 7];
    return morningTimes.includes(hour);
  }

  public async launchEvent(message: Message): Promise<void> {
    // 50% の確率 && 10分経過していればイベントを実行する
    if (
      !this.isRandomBoolean(0.5) ||
      !this.hasTimePassedByEvent(1000 * 60 * 10)
    )
      return;

    // 現在時刻を保存する
    this.dateNowMsBotTimer = Date.now();

    try {
      // 睡眠中のスタンプを取得
      const stampName = "hsn_huton";
      const dbx = new DropboxManager();
      const links = await dbx.fetchFileLinks(stampName);

      // Discord へスタンプを送信
      message.channel.send({
        embeds: links.map((link) => {
          return {
            image: { url: link },
          };
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 引数の値より生成ランダム値が高いかを判定する
   * @param value 小数点を含む0 ~ 1の値
   * @returns
   */
  private isRandomBoolean(value: number): boolean {
    return Math.random() > value;
  }

  /**
   * Morning イベントが起動してから指定ミリ秒数が経過したかを判定する
   * @param 指定ミリ秒数
   * @returns
   */
  private hasTimePassedByEvent(msPass: number): boolean {
    const msDiff = Date.now() - this.dateNowMsBotTimer;
    return msDiff > msPass;
  }
}
