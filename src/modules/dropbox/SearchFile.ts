import Connector from "./Connector.js";
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
 * Dropboxへの接続とデータ取得を実施する
 */
export default class SearchFile extends Connector {
  constructor(dbx?: Dropbox) {
    super(dbx);
  }

  public async fetchAll(fileName: string): Promise<SearchFileResult[]> {
    // ファイル名で検索して見つからない場合は、フォルダ内のファイル一覧を取得する
    // TODO: ここの処理を切り出す catch時にもフォルダ検索をできるように変える
    const searchFileResult = await this.fetchSearchFiles(fileName);
    const fileMetaData = searchFileResult.length
      ? searchFileResult
      : await this.fetchFilesInFolder();
    return fileMetaData;
  }

  /**
   * ファイル名で検索した結果を取得する
   * @param fileName ファイル名
   * @returns
   */
  private async fetchSearchFiles(
    fileName: string
  ): Promise<SearchV2Metadata[]> {
    const searchFileResult = await this.dbx
      .filesSearchV2({
        query: fileName,
      })
      .catch(() => {
        throw new Error(`Failed search files. => fileName: ${fileName}`);
      });
    // https://dropbox.github.io/dropbox-sdk-js/global.html#FilesMetadataV2
    // match.metadata.metadata にアクセスしようとするとtype error になるためObject.valuesで強制的に取り出している
    // それに伴い型anyとなったため明示的に得られるはずだった型に変換する
    return searchFileResult.result.matches.map(
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
  ): Promise<ListFolderMetadata[]> {
    const response = await this.dbx
      .filesListFolder({ path: pathName })
      .catch(() => {
        throw new Error(`Failed search paths. => pathName: ${pathName}`);
      });
    return response.result.entries;
  }
}
