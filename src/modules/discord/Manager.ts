import EventRegister from "./EventRegister.js";
import { Client, GatewayIntentBits, Message } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_TOKEN } = process.env;
const eventRegister = new EventRegister();

/**
 * Discordとのログイン及びイベントを定義する
 */
export default class DiscordManager {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.client.on("ready", () => {
      if (this.client.user)
        console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on("messageCreate", this.messageCreateEvent);
    this.client.login(DISCORD_TOKEN);
  }

  /**
   * Discord メッセージ作成イベント
   * @param message メッセージ
   */
  private messageCreateEvent = async (message: Message): Promise<void> => {
    try {
      if (message.author.bot) return;
      eventRegister.startPrioritizedEvent(message);
      // console.log(message);
    } catch (e: any) {
      console.error(e);
      // message.channel.send(e.message || "Exception Error.");
    }
  };
}
