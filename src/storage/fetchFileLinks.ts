import { fetchPathDisplays } from './search.js';
import { fetchDownloadLinks } from './link.js';

/**
 * Dropbox から対象ファイルのURLを取得する
 * @param fileName
 * @param pathName
 * @returns ファイルURL
 */
export default async function fetchFileLinks(
  fileName: string,
  pathName: string
): Promise<string[] | null> {
  try {
    const pathDisplays = await fetchPathDisplays(fileName, pathName);
    if (pathDisplays === null || pathDisplays.length === 0) {
      console.error(`Can not find file path. => fileName: ${fileName}`);
      return null;
    }

    // ファイルの共有リンクを取得する
    const fileLinks = await fetchDownloadLinks(pathDisplays);
    if (!fileLinks.length) {
      console.error(`Can not get file links. => fileName: ${fileName}`);
      return null;
    }

    return fileLinks;
  } catch (e: any) {
    console.error(e);
    return null;
  }
}
