import { Client, Message } from "discord.js";

export interface IChannelGroupType {
  readonly channelId: string;
  isTarget(): boolean;
  launchReadyEvent(client: Client): void;
  launchMessageEvent(message: Message): void;
}
