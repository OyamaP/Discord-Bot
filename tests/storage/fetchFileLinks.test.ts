import { Dropbox } from "../../__mocks__/dropbox.js";
import { fetchFileLinks } from "../../src/storage/fetchFileLinks.js";
import * as dotenv from "dotenv";
dotenv.config();

// モック全体を停止するにはimport と同じスコープで宣言する必要がある
// 本物のモジュールの動作を確認する際にはjest.unmock() のコメントアウトを外すこと
// jest.unmock("dropbox");

describe("fetchFileLinks", () => {

  test("正常系: ファイルのリンクを取得する", async () => {
    const fileName = "test_filename";
    const pathName = "/123456789001010101";
    const fileLinks = await fetchFileLinks(fileName, pathName);

    if (fileLinks === null) throw new Error();
    fileLinks.forEach((fileLink) => {
      expect(fileLink).toBe(
        "https://dl.dropboxusercontent.com/s/testdir/test_filename.jpg?dl=0"
      );
    });
  });

  test("異常系: ファイルのリンクを取得する際、ファイル検索に失敗", async () => {
    jest.spyOn(Dropbox.prototype, "filesSearchV2").mockImplementationOnce(() => {
      throw new Error("テスト用エラー");
    });
    const fileName = "test_filename";
    const pathName = "/123456789001010101";
    const fileLinks = await fetchFileLinks(fileName, pathName);
    expect(fileLinks).toBe(null);
  });

  test("異常系: ファイルのリンクを取得する際、共有リンク取得/作成に失敗", async () => {
    // 共有リンクを取得できない場合に共有リンクを作成する仕様のため
    // 両方をエラーモックにしておく
    jest.spyOn(Dropbox.prototype, "sharingListSharedLinks").mockImplementationOnce(() => {
      throw new Error("テスト用エラー");
    });
    jest.spyOn(Dropbox.prototype, "sharingCreateSharedLinkWithSettings").mockImplementationOnce(() => {
      throw new Error("テスト用エラー");
    });
    const fileName = "test_filename";
    const pathName = "/123456789001010101";
    const fileLinks = await fetchFileLinks(fileName, pathName);
    expect(fileLinks).toBe(null);
  });

  test.skip("実際のアクセス: ファイルのリンクを取得する", async () => {
    // 実行する際は jest.unmock() をトップレベルで実行してください
    const fileName = "yoshi";
    const pathName = `/${process.env.DISCORD_JEST_GUILD_ID || ""}`;
    const fileLinks = await fetchFileLinks(fileName, pathName);

    console.log(fileLinks);
    expect(fileLinks).toHaveLength(1);
  });
});
