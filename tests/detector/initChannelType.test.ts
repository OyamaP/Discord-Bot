import "env";
import { assertInstanceOf } from "https://deno.land/std@0.199.0/assert/mod.ts";
import initChannelType from "../../src/detector/initChannelType.ts";
import DevelopChannelType from "../../src/detector/DevelopChannelType.ts";
import StandardChannelType from "../../src/detector/StandardChannelType.ts";
import PremiumChannelType from "../../src/detector/PremiumChannelType.ts";
import { toSplitArray } from "../../src/detector/toSplitArray.ts";

const {
  DISCORD_DEVELOP_CHANNEL_ID,
  DISCORD_STANDARD_CHANNEL_ID,
  DISCORD_PREMIUM_CHANNEL_ID,
} = Deno.env.toObject();

Deno.test("initChannelType: DevelopChannelType の判定", () => {
  const channelIdEnv = DISCORD_DEVELOP_CHANNEL_ID || "";
  const channelIds = toSplitArray(channelIdEnv);
  const channelTypes = channelIds.map((channelId) =>
    initChannelType(channelId)
  );
  channelTypes.forEach((channelType) => {
    assertInstanceOf(channelType, DevelopChannelType);
  });
});

Deno.test("initChannelType: StandardChannelType の判定", () => {
  const channelIdEnv = DISCORD_STANDARD_CHANNEL_ID || "";
  const channelIds = toSplitArray(channelIdEnv);
  const channelTypes = channelIds.map((channelId) =>
    initChannelType(channelId)
  );
  channelTypes.forEach((channelType) => {
    assertInstanceOf(channelType, StandardChannelType);
  });
});

Deno.test("initChannelType: PremiumChannelType の判定", () => {
  const channelIdEnv = DISCORD_PREMIUM_CHANNEL_ID || "";
  const channelIds = toSplitArray(channelIdEnv);
  const channelTypes = channelIds.map((channelId) =>
    initChannelType(channelId)
  );
  channelTypes.forEach((channelType) => {
    assertInstanceOf(channelType, PremiumChannelType);
  });
});
