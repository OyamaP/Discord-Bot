import { schedule } from "node-cron";
import AbstructSendMessageSchedule from "./AbstructSendMessageSchedule.js";
import { fetchFileLinks } from "../storage/fetchFileLinks.js";
import { sendImageToChannel } from "../send/sendImageToChannel.js";

/**
 * 毎週土日の昼にメッセージを送信するスケジュールを登録/実行するクラス
 */
export default class SendMessageAtHolidayNoon extends AbstructSendMessageSchedule {
  public regist(): void {
    // 毎週土日13時のスケジュール設定
    schedule("0 13 * * 6,7", () => {
      this.send();
    });
  }

  public async send(): Promise<void> {
    try {
      // 祝日昼のスタンプを取得
      const stampName = "neka_noon";
      const imageLinks = await fetchFileLinks(stampName, `/${this.channelId}`);
      if (imageLinks === null) return;

      // Discord にスタンプ画像を送信
      sendImageToChannel(imageLinks, this.channel);
    } catch (e) {
      console.error(e);
    }
  }
}
