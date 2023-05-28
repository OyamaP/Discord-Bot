import Connector from "./Connector.js";
import SearchFile from "./SearchFile.js";
import SharedLink from "./SharedLink.js";
import { Dropbox, files } from "dropbox";

export type FileMetadata =
  | files.FileMetadataReference
  | files.FolderMetadataReference
  | files.DeletedMetadataReference
  | files.FileMetadata
  | files.FolderMetadata
  | files.DeletedMetadata;

/**
 * Dropboxへの接続とデータ取得を実施する
 */
export default class Manager extends Connector {
  private search: SearchFile;
  private link: SharedLink;

  constructor(dbx?: Dropbox) {
    super(dbx);
    this.search = new SearchFile(this.dbx);
    this.link = new SharedLink(this.dbx);
  }

  /**
   * ファイル一覧から共有URLを取得する
   * @param fileName ファイル名
   * @returns
   */
  public async fetchFileLinks(fileName: string): Promise<string[] | null> {
    try {
      // ファイル名で検索して見つからない場合は、フォルダ内のファイル一覧を取得する
      const fileMetaData = await this.search.fetchAll(fileName);
      if (fileMetaData === null) return null;

      // ファイルMetaData から対象ファイルのpath_displayを取り出す
      const pathDisplays = this.toPathDisplays(fileMetaData, fileName);
      if (!pathDisplays.length) {
        console.error(`Can not find file path. => fileName: ${fileName}`);
        return null;
      }

      // ファイルの共有リンクを取得する
      const sharedLinks = await this.link.fetchFileLinks(pathDisplays);
      if (!sharedLinks.length) {
        console.error(`Can not get file links. => fileName: ${fileName}`);
        return null;
      }

      return sharedLinks;
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }

  /**
   * MetaDataの一覧から指定ファイル名の表示パス(path_display)を抽出する
   * @param metaDataArray メタデータ
   * @param targetName フィルタリングする名前
   * @returns path_display[]
   */
  private toPathDisplays(
    metaDataArray: FileMetadata[],
    targetName: string
  ): string[] {
    return metaDataArray
      .filter((metaData) => metaData.name.split(".")[0] === targetName)
      .map((metaData) => metaData.path_display || `/${metaData.name}`);
  }
}
