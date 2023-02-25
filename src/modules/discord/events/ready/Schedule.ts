import { fetchFileLinks } from "../../utils/fetchFileLinks.js";
import { sendImageToChannel } from "../../utils/sendImageToChannel.js";
import { schedule } from "node-cron";
import { Client, TextChannel } from "discord.js";

export default class Schedule {
  public async register(client: Client, channelIds: string[]): Promise<void> {
    channelIds.forEach(async (channelId) => {
      // cache.get()で取得したChannelにはsend()が含まれない場合があるため明示的にTextChannelを定義する
      const channel = client.channels.cache.get(channelId) as
        | TextChannel
        | undefined;
      if (channel === undefined) return;

      // スケジュール設定 毎週土日 13時
      schedule("0 13 * * 6,7", () => {
        this.sendHolidayNoonMessage(channel);
      });
    });
  }

  /**
   * 土日昼にメッセージを送信する
   * @param channel
   */
  private async sendHolidayNoonMessage(channel: TextChannel) {
    try {
      // 祝日昼のスタンプを取得
      const stampName = "neka_noon";
      const imageLinks = await fetchFileLinks(stampName);

      // Discord にスタンプ画像を送信
      sendImageToChannel(imageLinks, channel);
    } catch (e) {
      console.error(e);
    }
  }
}
