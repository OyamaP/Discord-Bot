import ReadyEventManager from "./events/ready/EventManager.js";
import MessageEventManager from "./events/message/EventManager.js";
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DISCORD_TOKEN } = process.env;

const readyEventManager = new ReadyEventManager();
const messageEventManager = new MessageEventManager();

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
    // イベント定義
    client.on("ready", readyEventManager.registReadyEvent);
    client.on("messageCreate", messageEventManager.messageCreateEvent);

    // ログイン
    client.login(DISCORD_TOKEN);
  }
}
