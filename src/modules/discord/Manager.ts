import ReadyEventLauncher from "./events/ready/EventLauncher.js";
import MessageEventLauncher from "./events/message/EventLauncher.js";
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_TOKEN } = process.env;

/**
 * Discord イベントを定義してログインする
 */
export default class DiscordManager {
  constructor() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.eventRegister(client);
    client.login(DISCORD_TOKEN);
  }

  /**
   * Discord イベントを定義する
   * @param client
   */
  private eventRegister(client: Client): void {
    client.on("ready", new ReadyEventLauncher().init);
    client.on("messageCreate", new MessageEventLauncher().init);
  }
}
