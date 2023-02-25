import DropboxManager from "../../dropbox/Manager.js";

/**
 * Dropbox から対象ファイルのURLを取得する
 * @param fileName
 * @returns
 */
export async function fetchFileLinks(fileName: string): Promise<string[]> {
  try {
    const dbx = new DropboxManager();
    return dbx.fetchFileLinks(fileName);
  } catch (e: any) {
    throw e;
  }
}
