import { Dropbox } from 'dropbox';
import fetchFileLinks from '../../src/storage/fetchFileLinks.js';

describe('fetchFileLinks: mock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('正常系: ファイルのリンクを取得する', async () => {
    const fileName = 'test_filename';
    const pathName = '/123456789001010101';
    const fileLinks = await fetchFileLinks(fileName, pathName);

    fileLinks.forEach((fileLink) => {
      expect(fileLink).toBe(
        'https://dl.dropboxusercontent.com/s/testdir/test_filename.jpg?dl=0'
      );
    });
  });

  test('異常系: ファイルのリンクを取得する際、ファイル検索に失敗', async () => {
    jest
      .spyOn(Dropbox.prototype, 'filesSearchV2')
      .mockRejectedValueOnce(new Error('テスト用エラー'));
    const fileName = 'test_filename';
    const pathName = '/123456789001010101';
    const fileLinks = await fetchFileLinks(fileName, pathName);
    expect(fileLinks.length).toBe(0);
  });

  test('異常系: ファイルのリンクを取得する際、共有リンク取得/作成に失敗', async () => {
    // 共有リンクを取得できない場合に共有リンクを作成する仕様のため
    // 両方をエラーモックにしておく
    jest
      .spyOn(Dropbox.prototype, 'sharingListSharedLinks')
      .mockRejectedValueOnce(new Error('テスト用エラー'));
    jest
      .spyOn(Dropbox.prototype, 'sharingCreateSharedLinkWithSettings')
      .mockRejectedValueOnce(new Error('テスト用エラー'));
    const fileName = 'test_filename';
    const pathName = '/123456789001010101';
    const fileLinks = await fetchFileLinks(fileName, pathName);
    expect(fileLinks.length).toBe(0);
  });
});
