import { Client, Message } from 'discord.js';

export interface IChannelType {
  isTarget(channelId: string): boolean;
  launchReadyEvent(client: Readonly<Client>): void;
  launchMessageEvent(message: Readonly<Message>): void;
}
