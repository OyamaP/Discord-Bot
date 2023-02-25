import { Dropbox, files } from "dropbox";

export type SearchV2Metadata =
  | files.FileMetadata
  | files.FolderMetadata
  | files.DeletedMetadata;
export type ListFolderMetadata =
  | files.FileMetadataReference
  | files.FolderMetadataReference
  | files.DeletedMetadataReference;
export type SearchFileResult = SearchV2Metadata | ListFolderMetadata;

/**
 * Dropbox ファイル検索用クラス
 */
export default class SearchFile {
  private dbx: Dropbox;
  constructor(dbx: Dropbox) {
    this.dbx = dbx;
  }

  /**
   * ファイル名で全体検索をする
   * @param fileName
   * @returns
   */
  public async fetchAll(fileName: string): Promise<SearchFileResult[] | null> {
    // ファイル名で検索して見つからない場合は、フォルダ内のファイル一覧を取得する
    // TODO: 0件やcatch時にもフォルダ検索をできるように変える
    try {
      const searchFileResult =
        (await this.fetchSearchFiles(fileName)) ||
        (await this.fetchFilesInFolder());
      return searchFileResult;
    } catch (_) {
      return null;
    }
  }

  /**
   * ファイル名で検索した結果を取得する
   * @param fileName ファイル名
   * @returns
   */
  private async fetchSearchFiles(
    fileName: string
  ): Promise<SearchV2Metadata[] | null> {
    const response = await this.dbx
      .filesSearchV2({
        query: fileName,
      })
      .then((res) => res.result.matches)
      .catch(() => null);

    if (response === null || !response.length) {
      console.error(`Failed search files. => fileName: ${fileName}`);
      return null;
    }

    // https://dropbox.github.io/dropbox-sdk-js/global.html#FilesMetadataV2
    // match.metadata.metadata にアクセスしようとするとtype error になるためObject.valuesで強制的に取り出している
    // それに伴い型anyとなったため明示的に得られるはずだった型に変換する
    return response.map(
      (match) => Object.values(match.metadata)[1]
    ) as unknown as SearchV2Metadata[];
  }

  /**
   * パスに合致したフォルダ内のファイル一覧を取得する
   * @param pathName
   * @returns
   */
  private async fetchFilesInFolder(
    pathName: string = ""
  ): Promise<ListFolderMetadata[] | null> {
    const response = await this.dbx
      .filesListFolder({ path: pathName })
      .catch(() => null);

    if (response === null) {
      console.error(`Failed search paths. => pathName: ${pathName}`);
      return null;
    }

    return response.result.entries;
  }
}
