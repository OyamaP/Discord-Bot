import { Client, GatewayIntentBits } from 'discord.js';
import { setReadyEvent } from './event/ready/setReadyEvent.js';
import { setMessageEvent } from './event/message/setMessageEvent.js';
import * as dotenv from 'dotenv';
dotenv.config();
const { DISCORD_TOKEN } = process.env;

function main() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.on('ready', setReadyEvent);
  client.on('messageCreate', setMessageEvent);
  client.login(DISCORD_TOKEN);
}

main();
