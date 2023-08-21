import { schedule } from "cron";
import AbstructSendMessageSchedule from "./AbstructSendMessageSchedule.ts";
import fetchFileLinks from "../storage/fetchFileLinks.ts";
import { sendImageToChannel } from "../send/sendImageToChannel.ts";

/**
 * 毎週土日の昼にメッセージを送信するスケジュールを登録/実行するクラス
 */
export default class SendMessageAtHolidayNoon
  extends AbstructSendMessageSchedule {
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
      if (imageLinks.length === 0) {
        throw new Error(`Failed get file links. => ${stampName}`);
      }

      // Discord にスタンプ画像を送信
      await sendImageToChannel(this.bot, this.channelId, imageLinks);
    } catch (e) {
      console.error(e);
    }
  }
}
