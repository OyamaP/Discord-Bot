import { Bot, Message } from "discord";
import initChannelType from "../../detector/initChannelType.ts";

/**
 * メッセージを起因とするイベントを設定する
 */
export async function setMessageEvent(
  bot: Readonly<Bot>,
  message: Readonly<Message>,
): Promise<void> {
  const { channelId, guildId, content } = message;

  try {
    const user = await bot.helpers.getUser(message.authorId);
    console.log({
      channelId,
      guildId,
      messageId: message.id,
      userId: message.authorId,
      userName: user.username,
      content,
    });

    const targetChannelType = initChannelType(String(channelId));
    targetChannelType.launchMessageEvent(bot, message);
  } catch (e) {
    console.error(e);
  }
}
