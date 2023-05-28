import Connector from "../../src/modules/dropbox/Connector";
import SharedLink from "../../src/modules/dropbox/SharedLink";
import { sharing, DropboxResponse } from "dropbox";

const connector = new Connector();
const dbx = connector.dbx;
const share = new SharedLink(dbx);

// mock 共有リンク取得
const mockFetch = jest.spyOn(dbx, "sharingListSharedLinks");
type Fetch = Promise<DropboxResponse<sharing.ListSharedLinksResult>>;

// mock 共有リンク作成
type Create = Promise<
  DropboxResponse<
    | sharing.FileLinkMetadataReference
    | sharing.FolderLinkMetadataReference
    | sharing.SharedLinkMetadataReference
  >
>;
const mockCreate = jest.spyOn(dbx, "sharingCreateSharedLinkWithSettings");

const expectIsInclude = (
  pathDisplays: string[],
  sharedLinks: string[]
): void => {
  pathDisplays.forEach((pathDisplay) => {
    const url = `https://dl.dropboxusercontent.com/s/xxxxxxxxxx${pathDisplay}.jpg`;
    const isInclude = sharedLinks.includes(url);
    expect(isInclude).toBe(true);
  });
};

describe("fetchFileLinks", () => {
  it("正常系: 共有リンクがある場合、リンク生成しない", async () => {
    mockFetch.mockImplementation((arg: sharing.ListSharedLinksArg) => {
      const url = `https://www.dropbox.com/s/xxxxxxxxxx${arg.path}.jpg`;
      const result = { links: [{ url }] };
      return { result } as unknown as Fetch;
    });

    const pathDisplays = ["/test1", "/test2"];
    const sharedLinks = await share.fetchFileLinks(pathDisplays);
    expectIsInclude(pathDisplays, sharedLinks);
  });

  it("正常系: 共有リンクがない場合、リンク生成する", async () => {
    mockFetch.mockImplementation((_: sharing.ListSharedLinksArg) => {
      const result = { links: [{}] };
      return { result } as unknown as Fetch;
    });
    mockCreate.mockImplementation(
      (arg: sharing.CreateSharedLinkWithSettingsArg) => {
        const url = `https://www.dropbox.com/s/xxxxxxxxxx${arg.path}.jpg`;
        return { result: { url } } as unknown as Create;
      }
    );

    const pathDisplays = ["/test3", "/test4"];
    const sharedLinks = await share.fetchFileLinks(pathDisplays);
    expectIsInclude(pathDisplays, sharedLinks);
  });

  it("異常系: 共有リンク取得でエラーになったため、リンク生成する", async () => {
    mockFetch.mockImplementation((_: sharing.ListSharedLinksArg) => {
      throw new Error("fetch error");
    });
    mockCreate.mockImplementation(
      (arg: sharing.CreateSharedLinkWithSettingsArg) => {
        const url = `https://www.dropbox.com/s/xxxxxxxxxx${arg.path}.jpg`;
        return { result: { url } } as unknown as Create;
      }
    );

    const pathDisplays = ["/test5", "/test6"];
    const sharedLinks = await share.fetchFileLinks(pathDisplays);
    expectIsInclude(pathDisplays, sharedLinks);
  });

  it("異常系: 共有リンク取得, 生成共にエラーとなった場合Errorを生成する", async () => {
    mockFetch.mockImplementation((_: sharing.ListSharedLinksArg) => {
      throw new Error("fetch error");
    });
    mockCreate.mockImplementation(
      (_: sharing.CreateSharedLinkWithSettingsArg) => {
        throw new Error("create error");
      }
    );

    const pathDisplays = ["/test7", "/test8"];
    expect.assertions(1);
    // エラー発生時のパス名を含むメッセージが返却されるため、配列を予め生成する
    const errorMessages = pathDisplays.map((pathDisplay) => {
      return `Failed get shared link. => pathDisplay: ${pathDisplay}`;
    });
    share.fetchFileLinks(pathDisplays).catch((e) => {
      const isInclude = errorMessages.includes(e.message);
      expect(isInclude).toBe(true);
    });
  });
});
