import Manager, { FileMetadata } from "../../src/modules/dropbox/Manager";

const manager = new Manager();

describe("Dropbox Manager", () => {
  it("MetaDataの一覧から指定ファイル名の表示パス(path_display)を抽出する", () => {
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
    const pathDisplays = manager["toPathDisplays"](metaDataArray, targetName);
    expect(pathDisplays).toHaveLength(2);
    pathDisplays.forEach((pathDisplay) => {
      expect(pathDisplay).toBe(`/${targetName}`);
    });
  });
  it("test", () => {
    const spy = jest.spyOn(Math, "random").mockImplementation(() => 0.1);
    const randomCheck = (value: number) => {
      const random = Math.random();
      console.log(random);
      return random < value;
    };
    const isCheck = randomCheck(0.5);
  });
});
