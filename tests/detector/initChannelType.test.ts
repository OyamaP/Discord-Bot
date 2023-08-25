import initChannelType from '../../src/detector/initChannelType.js';
import DevelopChannelType from '../../src/detector/DevelopChannelType.js';
import StandardChannelType from '../../src/detector/StandardChannelType.js';
import PremiumChannelType from '../../src/detector/PremiumChannelType.js';
import { toSplitArray } from '../../src/detector/toSplitArray.js';
import * as dotenv from 'dotenv';
dotenv.config();

describe('initChannelType', () => {
  test('DevelopChannelType の判定', () => {
    const channelIdEnv = process.env.DISCORD_DEVELOP_CHANNEL_ID || '';
    const channelIds = toSplitArray(channelIdEnv);
    const channelTypes = channelIds.map((channelId) =>
      initChannelType(channelId)
    );
    channelTypes.forEach((channelType) => {
      expect(channelType instanceof DevelopChannelType).toBeTruthy();
    });
  });

  test('StandardChannelType の判定', () => {
    const channelIdEnv = process.env.DISCORD_STANDARD_CHANNEL_ID || '';
    const channelIds = toSplitArray(channelIdEnv);
    const channelTypes = channelIds.map((channelId) =>
      initChannelType(channelId)
    );
    channelTypes.forEach((channelType) => {
      expect(channelType instanceof StandardChannelType).toBeTruthy();
    });
  });

  test('PremiumChannelType の判定', () => {
    const channelIdEnv = process.env.DISCORD_PREMIUM_CHANNEL_ID || '';
    const channelIds = toSplitArray(channelIdEnv);
    const channelTypes = channelIds.map((channelId) =>
      initChannelType(channelId)
    );
    channelTypes.forEach((channelType) => {
      expect(channelType instanceof PremiumChannelType).toBeTruthy();
    });
  });
});
