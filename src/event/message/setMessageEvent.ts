import { Message } from 'discord.js';
import { initChannelType } from '../../detector/channelType.js';

/**
 * メッセージを起因とするイベントを設定する
 */
export function setMessageEvent(message: Message): void {
  if (message.author.bot) return;
  const { channelId, guildId, content, createdTimestamp } = message;
  const { bot, username, discriminator } = message.author;
  console.log({
    channelId,
    guildId,
    messageId: message.id,
    userId: message.author.id,
    userName: username,
    isBot: bot,
    discriminator,
    content,
    timestamp: new Date(createdTimestamp),
  });

  try {
    const targetChannelType = initChannelType(channelId);
    targetChannelType.launchMessageEvent(message);
  } catch (e: any) {
    console.error(e);
  }
}
