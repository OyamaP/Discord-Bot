import { IChannelGroupType } from "./IChannelGroupType.js";
import DevelopChannelType from "./DevelopChannelType.js";
import StandardChannelType from "./StandardChannelType.js";
import PremiumChannelType from "./PremiumChannelType.js";

export function initChannelType(channelId: string): IChannelGroupType {
  const channeltypes: IChannelGroupType[] = [
    new DevelopChannelType(channelId),
    new StandardChannelType(channelId),
    new PremiumChannelType(channelId),
  ];

  // 20230618 時点の仕様では複数のタイプに合致する可能性がある
  // 通常find()で良いが複数合致した場合のエラー処理を行うためfilter()を利用
  const targetChannelTypes = channeltypes.filter((channelType) =>
    channelType.isTarget()
  );
  if (targetChannelTypes.length === 0)
    throw new Error(
      `${channelId}のチャンネルIDはいずれのタイプにも合致しません`
    );
  if (targetChannelTypes.length > 1)
    throw new Error(`${channelId}のチャンネルIDは複数のタイプに合致しています`);

  return targetChannelTypes[0];
}

export function getChannelTypes(): IChannelGroupType[] {
  const channeltypes: IChannelGroupType[] = [
    new DevelopChannelType("unknown"),
    new StandardChannelType("unknown"),
    new PremiumChannelType("unknown"),
  ];

  return channeltypes;
}
