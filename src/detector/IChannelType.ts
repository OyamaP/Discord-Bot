import { Client, Message } from 'discord.js';

export interface IChannelType {
  isTarget(channelId: string): boolean;
  launchReadyEvent(client: Client): void;
  launchMessageEvent(message: Message): void;
}
