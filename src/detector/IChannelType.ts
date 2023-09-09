import { Bot, Message } from "discord";
import { Payload } from "../type.ts";

export interface IChannelType {
  isTarget(channelId: string): boolean;
  launchReadyEvent(bot: Readonly<Bot>, payload: Readonly<Payload>): void;
  launchMessageEvent(bot: Readonly<Bot>, message: Readonly<Message>): void;
}
