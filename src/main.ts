import "env";
import { Bot, createBot, Intents, Message, startBot } from "discord";
import { setReadyEvent } from "./event/ready/setReadyEvent.ts";
import { setMessageEvent } from "./event/message/setMessageEvent.ts";
import { Payload } from "./type.ts";

const { DISCORD_TOKEN } = Deno.env.toObject();

const bot = createBot({
  token: DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready(bot: Readonly<Bot>, payload: Readonly<Payload>) {
      setReadyEvent(bot, payload);
    },
    messageCreate(bot: Readonly<Bot>, message: Readonly<Message>) {
      if (message.isFromBot) return;
      setMessageEvent(bot, message);
    },
  },
});

await startBot(bot);
