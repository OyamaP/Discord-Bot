import { schedule } from "node-cron";
import { Client, TextChannel } from "discord.js";
import DropboxManager from "../../../dropbox/Manager.js";

export default class Schedule {
  public async register(client: Client, channelIds: string[]): Promise<void> {
    channelIds.forEach(async (channelId) => {
      // cache.get()で取得したChannelにはsend()が含まれない場合があるため明示的にTextChannelを定義する
      const channel = client.channels.cache.get(channelId) as
        | TextChannel
        | undefined;
      // cache.get() はundifined の可能性もあるためエスケープ
      if (channel === undefined) return;

      // スケジュール設定 毎週土日 13時
      schedule("0 13 * * 6,7", () => {
        this.sendHolidayNoonMessage(channel);
      });
    });
  }

  private async sendHolidayNoonMessage(channel: TextChannel) {
    try {
      // 祝日昼のスタンプを取得
      const stampName = "neka_noon";
      const dbx = new DropboxManager();
      const links = await dbx.fetchFileLinks(stampName);

      // Discord へスタンプを送信
      channel.send({
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
}
