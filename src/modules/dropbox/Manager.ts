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
    try {
      // ファイル名で検索して見つからない場合は、フォルダ内のファイル一覧を取得する
      const searchFileResult = await this.fetchSearchFiles(fileName);
      const fileMetaData = searchFileResult.length
        ? searchFileResult
        : await this.fetchFilesInFolder();

      // ファイルMetaData からpath_displayを取り出す
      const pathDisplays = DropboxFormatter.toPathDisplays(
        fileMetaData,
        fileName
      );
      if (!pathDisplays.length)
        throw new Error(`Can not find file path. => fileName: ${fileName}`);

      return this.fetchSharedDownloadLinks(pathDisplays);
    } catch (e: any) {
      console.error(e);
      return [];
    }
  }

  /**
   * ファイル名で検索した結果を取得する
   * @param fileName ファイル名
   * @returns
   */
  private async fetchSearchFiles(fileName: string) {
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
    ) as unknown as (
      | files.FileMetadata
      | files.FolderMetadata
      | files.DeletedMetadata
    )[];
  }

  /**
   * パスに合致したフォルダ内のファイル一覧を取得する
   * @param pathName
   * @returns
   */
  private async fetchFilesInFolder(
    pathName: string = ""
  ): Promise<
    (
      | files.FileMetadataReference
      | files.FolderMetadataReference
      | files.DeletedMetadataReference
    )[]
  > {
    const response = await this.dbx
      .filesListFolder({ path: pathName })
      .catch(() => {
        throw new Error(`Failed search paths. => pathName: ${pathName}`);
      });
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
          throw new Error(
            `Failed get shared link. => pathDisplay: ${pathDisplay}`
          );
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
    const response = await this.dbx
      .sharingCreateSharedLinkWithSettings({
        path: pathDisplay,
      })
      .catch(() => {
        throw new Error(`Failed create link. => pathDisplay: ${pathDisplay}`);
      });
    return response.result.url;
  }
}
