import Connector from "./Connector.js";
import { Dropbox } from "dropbox";

/**
 * Dropboxへの接続とデータ取得を実施する
 */
export default class SharedLink extends Connector {
  constructor(dbx?: Dropbox) {
    super(dbx);
  }

  /**
   * 表示パス(path_display)から共有リンクを取得する
   * @param pathDisplays 表示パス
   * @returns
   */
  public async fetchFileLinks(pathDisplays: string[]): Promise<string[]> {
    return Promise.all(
      pathDisplays.map(async (pathDisplay) => {
        // 共有リンクがなければ作成する
        const url =
          (await this.fetchSharedLink(pathDisplay)) ||
          (await this.createSharedLink(pathDisplay));
        if (url === undefined)
          throw new Error(
            `Failed get shared link. => pathDisplay: ${pathDisplay}`
          );
        return this.toDownloadUrl(url);
      })
    );
  }

  /**
   * 共有リンクを検索して取得する
   * @param pathDisplay
   * @returns
   */
  private async fetchSharedLink(
    pathDisplay: string
  ): Promise<string | undefined> {
    const response = await this.dbx.sharingListSharedLinks({
      path: pathDisplay,
    });
    const [link] = response.result.links;
    return link?.url;
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

  /**
   * Dropboxの共有URLからダウンロードURLへ置換する
   * @param url 共有URL
   * @returns ダウンロードURL
   */
  private toDownloadUrl(url: string): string {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }
}
