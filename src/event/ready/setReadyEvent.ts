import { Bot } from "discord";
import { Payload } from "../../type.ts";
// import startAliveMonitorIfNeed from "./aliveMonitor.ts";
// import { getChannelTypes } from "../../detector/initChannelType.ts";

/**
 * ボット開始時にイベントを設定する
 */
export function setReadyEvent(
  _bot: Readonly<Bot>,
  payload: Readonly<Payload>,
): void {
  if (payload.user) console.log(`Logged in as ${payload.user.username}!`);

  // const channelTypes = getChannelTypes();
  // channelTypes.forEach((channelType) =>
  //   channelType.launchReadyEvent(bot, payload)
  // );

  // startAliveMonitorIfNeed(bot, payload);
}
