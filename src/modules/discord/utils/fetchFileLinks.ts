import DropboxManager from "../../dropbox/Manager.js";

/**
 * Dropbox から対象ファイルのURLを取得する
 * @param fileName
 * @returns
 */
export async function fetchFileLinks(
  fileName: string
): Promise<string[] | null> {
  const dbx = new DropboxManager();
  return dbx.fetchFileLinks(fileName);
}
