import { Bot } from "discord";
import { Payload } from "../../type.ts";
import { getChannelTypes } from "../../detector/initChannelType.ts";

/**
 * メッセージを起因とするイベントを設定する
 */
export function setReadyEvent(
  bot: Readonly<Bot>,
  payload: Readonly<Payload>,
): void {
  if (payload.user) console.log(`Logged in as ${payload.user.username}!`);

  const channelTypes = getChannelTypes();
  channelTypes.forEach((channelType) =>
    channelType.launchReadyEvent(bot, payload)
  );
}
