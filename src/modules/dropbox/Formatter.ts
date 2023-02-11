import { files } from "dropbox";

export type FileMetadata =
  | files.FileMetadataReference
  | files.FolderMetadataReference
  | files.DeletedMetadataReference
  | files.FileMetadata
  | files.FolderMetadata
  | files.DeletedMetadata;

export default class DropboxFormatter {
  /**
   * MetaDataの一覧から指定ファイル名の表示パス(path_display)を抽出する
   * @param metaDataArray メタデータ
   * @param targetName フィルタリングする名前
   * @returns path_display[]
   */
  static toPathDisplays(
    metaDataArray: FileMetadata[],
    targetName: string
  ): string[] {
    return metaDataArray
      .filter((metaData) => metaData.name.split(".")[0] === targetName)
      .map((metaData) => metaData.path_display || `/${metaData.name}`);
  }

  /**
   * Dropboxの共有URLからダウンロードURLへ置換する
   * @param url 共有URL
   * @returns ダウンロードURL
   */
  static toDownloadUrl(url: string): string {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }
}
