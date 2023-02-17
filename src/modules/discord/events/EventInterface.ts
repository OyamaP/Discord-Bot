import { Message } from "discord.js";

export default interface EventInterface {
  isTargetEvent(message: Message): boolean;
  startTargetEvent(message: Message): Promise<void>;
}
