import { Dropbox, DropboxOptions, files } from "dropbox";
import DropboxFormatter from "./Formatter.js";
import * as dotenv from "dotenv";
dotenv.config();
const { DROPBOX_ID, DROPBOX_SECRET, DROPBOX_REFRESH_TOKEN } = process.env;

/**
 * Dropboxへの接続とデータ取得を実施する
 */
export default class DropboxManager {
  private dbx: Dropbox;
  private config: DropboxOptions = {
    clientId: DROPBOX_ID,
    clientSecret: DROPBOX_SECRET,
    refreshToken: DROPBOX_REFRESH_TOKEN,
  };

  constructor() {
    this.dbx = new Dropbox(this.config);
  }

  /**
   * ファイル一覧から共有URLを取得する
   * @param fileName ファイル名
   * @returns
   */
  public async fetchFileLinks(fileName: string): Promise<string[]> {
    // ファイル名で検索して見つからない場合はフォルダ内のファイル一覧を取得する
    const fileSearchResult = await this.fetchFilesSearch(fileName);
    const fileList = fileSearchResult.length
      ? fileSearchResult
      : await this.fetchFilesListFolder();
    const pathDisplays = DropboxFormatter.toPathDisplays(fileList, fileName);
    if (!pathDisplays.length) throw new Error("Error: Can not find file path.");
    return this.fetchSharedDownloadLinks(pathDisplays);
  }

  /**
   * ファイル名で検索した結果を取得する
   * @param fileName ファイル名
   * @returns
   */
  private async fetchFilesSearch(fileName: string) {
    const response = await this.dbx.filesSearchV2({
      query: fileName,
    });
    // https://dropbox.github.io/dropbox-sdk-js/global.html#FilesMetadataV2
    // match.metadata.metadata にアクセスしようとするとtype error になるためObject.valuesで強制的に取り出している
    // それに伴い型anyとなったため明示的に得られるはずだった型に変換する
    return response.result.matches.map(
      (match) => Object.values(match.metadata)[1]
    ) as unknown as (
      | files.FileMetadata
      | files.FolderMetadata
      | files.DeletedMetadata
    )[];
  }

  /**
   * パスに合致したフォルダ内のファイル一覧を取得する
   * @param targetPath
   * @returns
   */
  private async fetchFilesListFolder(
    targetPath: string = ""
  ): Promise<
    (
      | files.FileMetadataReference
      | files.FolderMetadataReference
      | files.DeletedMetadataReference
    )[]
  > {
    const response = await this.dbx.filesListFolder({ path: targetPath });
    return response.result.entries;
  }

  /**
   * 表示パス(path_display)から共有リンクを取得する
   * @param pathDisplays 表示パス
   * @returns
   */
  private async fetchSharedDownloadLinks(
    pathDisplays: string[]
  ): Promise<string[]> {
    return Promise.all(
      pathDisplays.map(async (pathDisplay) => {
        const response = await this.dbx.sharingListSharedLinks({
          path: pathDisplay,
        });
        const [link] = response.result.links;
        const url = link ? link.url : await this.createSharedLink(pathDisplay);
        if (url === undefined)
          throw new Error("Error: Can not get shared link.");
        return DropboxFormatter.toDownloadUrl(url);
      })
    );
  }

  /**
   * アップロードされたファイルの共有リンクを生成取得する
   * @param pathDisplay 表示パス
   * @returns 共有リンク
   */
  private async createSharedLink(pathDisplay: string): Promise<string> {
    const response = await this.dbx.sharingCreateSharedLinkWithSettings({
      path: pathDisplay,
    });
    return response.result.url;
  }
}
