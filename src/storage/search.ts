import { Dropbox, files } from 'dropbox';
import * as dotenv from 'dotenv';
dotenv.config();

const initDropbox = () => {
  const dbx = new Dropbox({
    clientId: process.env.DROPBOX_ID,
    clientSecret: process.env.DROPBOX_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
  });

  return dbx;
};

export const fetchPathDisplays = async (
  fileName: string,
  pathName: string
): Promise<string[] | null> => {
  const metaData = await fetchFileMetadata(fileName, pathName);
  if (metaData === null) return null;

  const pathDisplays = metaData
    // metadataには類似した検索結果が含まれるため、厳密に名前を取り出す必要がある
    // 取得したファイル名には拡張子が含まれるため、split()で取り出して比較する
    .filter((metadata) => metadata.metadata.name.split('.')[0] === fileName)
    // path_display は型にundefinedを含むため除外する必要がある
    .map((data) => data.metadata.path_display)
    .filter(
      (pathDisplay): pathDisplay is Exclude<typeof pathDisplay, undefined> =>
        pathDisplay !== undefined
    );

  return pathDisplays;
};

const fetchFileMetadata = async (
  fileName: string,
  pathName: string
): Promise<files.MetadataV2Metadata[] | null> => {
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
    console.error(`Failed search files. => ${pathName}/${fileName}`);
    return null;
  }
};

const isMetadataV2Metadata = (
  value: unknown
): value is files.MetadataV2Metadata => {
  return value !== null && typeof value === 'object' && 'metadata' in value;
};
