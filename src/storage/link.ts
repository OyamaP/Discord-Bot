import initDropbox from "./initDropbox.ts";

/**
 * 表示パス(path_display)からダウンロードリンクを取得する。
 * @param pathDisplays 表示パス
 * @returns ダウンロードリンク
 */
export const fetchDownloadLinks = (
  pathDisplays: readonly string[],
): Promise<string[]> => {
  return Promise.all(
    pathDisplays.map(async (pathDisplay) => {
      // 共有リンクを検索して、ない場合に作成する
      const sharedLinkByFetch = await fetchSharedLink(pathDisplay);
      if (sharedLinkByFetch !== undefined) {
        return toDownloadUrl(sharedLinkByFetch);
      }
      const sharedLinkByCreate = await createSharedLink(pathDisplay);
      if (sharedLinkByCreate !== undefined) {
        return toDownloadUrl(sharedLinkByCreate);
      }

      throw new Error(`Failed get shared link. => pathDisplay: ${pathDisplay}`);
    }),
  );
};

/**
 * 共有リンクを検索して取得する
 * @param pathDisplay
 * @returns 共有リンク
 */
const fetchSharedLink = async (
  pathDisplay: string,
): Promise<string | undefined> => {
  try {
    const dbx = initDropbox();
    const response = await dbx.sharingListSharedLinks({
      path: pathDisplay,
    });
    const [link] = response.result.links;
    return link.url;
  } catch {
    console.log(`Failed fetch link. => pathDisplay: ${pathDisplay}`);
    return undefined;
  }
};

/**
 * ファイルの共有リンクを生成取得する
 * @param pathDisplay 表示パス
 * @returns 共有リンク
 */
const createSharedLink = async (
  pathDisplay: string,
): Promise<string | undefined> => {
  try {
    const dbx = initDropbox();
    const response = await dbx.sharingCreateSharedLinkWithSettings({
      path: pathDisplay,
    });
    return response.result.url;
  } catch (e) {
    console.log(`Failed create link. => pathDisplay: ${pathDisplay}`);
    return undefined;
  }
};

/**
 * 共有URLからダウンロードURLへ置換する
 * @param url 共有URL
 * @returns ダウンロードURL
 */
const toDownloadUrl = (url: string): string => {
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
};
