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
): Promise<string[]> {
  try {
    const pathDisplays = await fetchPathDisplays(fileName, pathName);
    if (pathDisplays.length === 0) {
      throw new Error(`Can not find file path. => fileName: ${fileName}`);
    }

    // ファイルの共有リンクを取得する
    const fileLinks = await fetchDownloadLinks(pathDisplays);
    if (!fileLinks.length) {
      throw new Error(`Can not get file links. => fileName: ${fileName}`);
    }

    return fileLinks;
  } catch (e: any) {
    console.error(e);
    return [];
  }
}
