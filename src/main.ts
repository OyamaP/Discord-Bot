import "env";
import { Bot, createBot, Intents, Message, startBot } from "discord";
import { serveListener } from "server";
import { setReadyEvent } from "./event/ready/setReadyEvent.ts";
import { setMessageEvent } from "./event/message/setMessageEvent.ts";
import { Payload } from "./type.ts";

const listener = Deno.listen({ port: 8000 });
console.log("Start: server on port 8000");
// 死活監視用にstatus200のみを返す設定
serveListener(listener, (_request: any) => {
  const body = `status: 200`;

  return new Response(body, { status: 200 });
});

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
