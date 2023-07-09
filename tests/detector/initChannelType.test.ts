import initChannelType from '../../src/detector/initChannelType.js';
import DevelopChannelType from '../../src/detector/DevelopChannelType.js';
import StandardChannelType from '../../src/detector/StandardChannelType.js';
import PremiumChannelType from '../../src/detector/PremiumChannelType.js';
import * as dotenv from 'dotenv';
dotenv.config();

describe('initChannelType', () => {
  test('DevelopChannelType の判定', () => {
    const channelType = initChannelType(
      process.env.DISCORD_DEVELOP_CHANNEL_ID || ''
    );
    expect(channelType instanceof DevelopChannelType).toBeTruthy();
  });

  test('StandardChannelType の判定', () => {
    const channelType = initChannelType(
      process.env.DISCORD_STANDARD_CHANNEL_ID || ''
    );
    expect(channelType instanceof StandardChannelType).toBeTruthy();
  });

  test('PremiumChannelType の判定', () => {
    const channelType = initChannelType(
      process.env.DISCORD_PREMIUM_CHANNEL_ID || ''
    );
    expect(channelType instanceof PremiumChannelType).toBeTruthy();
  });
});
