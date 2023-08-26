import "env";
import { Bot } from "discord";
import { cron } from "cron";
import { Payload } from "../../type.ts";

const {
  ALIVE_MONITORING,
  DISCORD_DENO_DEPLOY_MONITOR_CHANNEL_ID,
} = Deno.env.toObject();

/**
 * 死活監視を必要な設定であればスタートする
 * cron で10秒ごとに指定したチャンネルにメッセージを送信する
 */
const startAliveMonitorIfNeed = (
  bot: Readonly<Bot>,
  _payload: Readonly<Payload>
): void => {
  if (Boolean(ALIVE_MONITORING) === false) return
  console.log("Start: Alive Monitor.");

  cron("0 */5 * * * *", async () => {
    try {
      await bot.helpers.sendMessage(
        DISCORD_DENO_DEPLOY_MONITOR_CHANNEL_ID,
        { content: "I am living." },
      );  
    } catch (e: any) {
      console.error(e);
      throw new Error("死活監視のメッセージ送信処理が失敗しました");
    }
  });
};

export default startAliveMonitorIfNeed;

