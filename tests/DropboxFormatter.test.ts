import DropboxFormatter, { FileMetadata } from "@/modules/dropbox/Formatter";

describe("Dropbox Formatter", () => {
  test("MetaDataの一覧から指定ファイル名の表示パス(path_display)を抽出する", () => {
    const metaDataArray = [
      {
        name: "kotatsu",
        path_display: "/kotatsu",
      },
      {
        name: "kotatsu",
      },
      {
        name: "huton",
      },
    ] as FileMetadata[];
    const targetName = "kotatsu";
    const pathDisplays = DropboxFormatter.toPathDisplays(
      metaDataArray,
      targetName
    );
    expect(pathDisplays).toHaveLength(2);
    pathDisplays.forEach((pathDisplay) => {
      expect(pathDisplay).toBe(`/${targetName}`);
    });
  });

  test("Dropboxの共有URLからダウンロードURLへ置換する", () => {
    const fileName = "kotatsu";
    const linkUrl = `https://www.dropbox.com/s/xxxxxxxxxx/${fileName}.jpg?dl=0`;
    const downloadUrl = DropboxFormatter.toDownloadUrl(linkUrl);
    const reg = new RegExp(
      `^https:\/\/dl.dropboxusercontent\.com\/s\/.+\/${fileName}\..+`
    );
    expect(downloadUrl).toMatch(reg);
  });
});
