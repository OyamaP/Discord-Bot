import fetchFileLinks from '../../src/storage/fetchFileLinks.js';
import * as dotenv from 'dotenv';
dotenv.config();

// マニュアルモックを停止するにはimportと同じスコープでunmock()する必要がある
jest.unmock('dropbox');

describe('fetchFileLinks: actual', () => {
  test('ファイルのリンクを取得する', async () => {
    const fileName = 'yoshi';
    const pathName = `/${process.env.DISCORD_JEST_GUILD_ID || ''}`;
    const fileLinks = await fetchFileLinks(fileName, pathName);

    console.log(fileLinks);
    expect(fileLinks).toHaveLength(1);
  });
});
