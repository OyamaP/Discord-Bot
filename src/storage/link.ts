import { Dropbox } from 'dropbox';
import * as dotenv from 'dotenv';
dotenv.config();

const initDropbox = () => {
  const dbx = new Dropbox({
    clientId: process.env.DROPBOX_ID,
    clientSecret: process.env.DROPBOX_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
  });

  return dbx;
};

/**
 * 表示パス(path_display)からダウンロードリンクを取得する。
 * @param pathDisplays 表示パス
 * @returns ダウンロードリンク
 */
export const fetchDownloadLinks = async (
  pathDisplays: string[]
): Promise<string[]> => {
  return Promise.all(
    pathDisplays.map(async (pathDisplay) => {
      // 共有リンクを検索して、ない場合に作成する
      let url: string | null = await fetchSharedLink(pathDisplay);
      if (url === null) url = await createSharedLink(pathDisplay);
      if (url === null)
        throw new Error(
          `Failed get shared link. => pathDisplay: ${pathDisplay}`
        );

      return toDownloadUrl(url);
    })
  );
};

/**
 * 共有リンクを検索して取得する
 * @param pathDisplay
 * @returns 共有リンク
 */
const fetchSharedLink = async (pathDisplay: string): Promise<string | null> => {
  try {
    const dbx = initDropbox();
    const response = await dbx.sharingListSharedLinks({
      path: pathDisplay,
    });
    const [link] = response.result.links;
    return link.url;
  } catch {
    console.log(`Failed fetch link. => pathDisplay: ${pathDisplay}`);
    return null;
  }
};

/**
 * ファイルの共有リンクを生成取得する
 * @param pathDisplay 表示パス
 * @returns 共有リンク
 */
const createSharedLink = async (
  pathDisplay: string
): Promise<string | null> => {
  try {
    const dbx = initDropbox();
    const response = await dbx.sharingCreateSharedLinkWithSettings({
      path: pathDisplay,
    });
    return response.result.url;
  } catch (e) {
    console.log(`Failed create link. => pathDisplay: ${pathDisplay}`);
    return null;
  }
};

/**
 * 共有URLからダウンロードURLへ置換する
 * @param url 共有URL
 * @returns ダウンロードURL
 */
const toDownloadUrl = (url: string): string => {
  return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
};
