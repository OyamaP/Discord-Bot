import { Dropbox } from "dropbox";

/**
 * Dropbox 共有リンク用クラス
 */
export default class SharedLink {
  private dbx: Dropbox;
  constructor(dbx: Dropbox) {
    this.dbx = dbx;
  }

  /**
   * 表示パス(path_display)から共有リンクを取得する。
   * 非同期で並列処理して、1つでも失敗した時点で終了してエラーが発生する。
   * @param pathDisplays 表示パス
   * @returns
   */
  public async fetchFileLinks(pathDisplays: string[]): Promise<string[]> {
    return Promise.all(
      pathDisplays.map(async (pathDisplay) => {
        // 共有リンクが検索して、ない場合に作成する
        const url =
          (await this.fetchSharedLink(pathDisplay)) ||
          (await this.createSharedLink(pathDisplay));
        if (url === null)
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
  private async fetchSharedLink(pathDisplay: string): Promise<string | null> {
    try {
      const response = await this.dbx.sharingListSharedLinks({
        path: pathDisplay,
      });
      const [link] = response.result.links;
      return link?.url || null;
    } catch {
      console.log(`Failed fetch link. => pathDisplay: ${pathDisplay}`);
      return null;
    }
  }

  /**
   * ファイルの共有リンクを生成取得する
   * @param pathDisplay 表示パス
   * @returns 共有リンク
   */
  private async createSharedLink(pathDisplay: string): Promise<string | null> {
    try {
      const response = await this.dbx.sharingCreateSharedLinkWithSettings({
        path: pathDisplay,
      });
      return response.result.url;
    } catch (e) {
      console.log(`Failed create link. => pathDisplay: ${pathDisplay}`);
      return null;
    }
  }

  /**
   * 共有URLからダウンロードURLへ置換する
   * @param url 共有URL
   * @returns ダウンロードURL
   */
  private toDownloadUrl(url: string): string {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }
}
