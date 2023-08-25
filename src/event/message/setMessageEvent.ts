import { Message } from 'discord.js';
import initChannelType from '../../detector/initChannelType.js';

/**
 * メッセージを起因とするイベントを設定する
 */
export function setMessageEvent(message: Readonly<Message>): void {
  if (message.author.bot) return;
  const { channelId, guildId, content } = message;
  const { username } = message.author;
  console.log({
    channelId,
    guildId,
    messageId: message.id,
    userId: message.author.id,
    userName: username,
    content,
  });

  try {
    const targetChannelType = initChannelType(channelId);
    targetChannelType.launchMessageEvent(message);
  } catch (e: any) {
    console.error(e);
  }
}
