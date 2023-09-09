import { files } from "dropbox";
import initDropbox from "./initDropbox.ts";

export const fetchPathDisplays = async (
  fileName: string,
  pathName: string,
): Promise<string[]> => {
  try {
    const metaData = await fetchFileMetadata(fileName, pathName);
    if (metaData.length === 0) throw new Error();

    const pathDisplays = metaData
      // metadataには類似した検索結果が含まれるため、厳密に名前を取り出す必要がある
      // 取得したファイル名には拡張子が含まれるため、split()で取り出して比較する
      .filter((metadata) => metadata.metadata.name.split(".")[0] === fileName)
      // path_display は型にundefinedを含むため除外する必要がある
      .map((data) => data.metadata.path_display)
      .filter(
        (pathDisplay): pathDisplay is Exclude<typeof pathDisplay, undefined> =>
          pathDisplay !== undefined,
      );

    return pathDisplays;
  } catch (e) {
    console.error(e);
    console.error(`Failed search file paths. => ${pathName}/${fileName}`);
    return [];
  }
};

const fetchFileMetadata = async (
  fileName: string,
  pathName: string,
): Promise<files.MetadataV2Metadata[]> => {
  try {
    const dbx = initDropbox();
    const response = await dbx.filesSearchV2({
      query: fileName,
      options: {
        path: `${pathName}`,
      },
    });
    const matches = response.result.matches;
    if (matches.length === 0) throw new Error();

    const metadata = matches
      .map((match) => match.metadata)
      .filter((metadata): metadata is files.MetadataV2Metadata =>
        isMetadataV2Metadata(metadata)
      );

    return metadata;
  } catch (e) {
    console.error(e);
    console.error(`Failed search file metadata. => ${pathName}/${fileName}`);
    return [];
  }
};

const isMetadataV2Metadata = (
  value: unknown,
): value is files.MetadataV2Metadata => {
  return value !== null && typeof value === "object" && "metadata" in value;
};
