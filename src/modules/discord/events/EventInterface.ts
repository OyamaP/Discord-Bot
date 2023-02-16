import { Message } from "discord.js";

export default interface EventInterface {
  isTargetEvent(message: Message): boolean;
  startEvent(message: Message): Promise<void>;
}
