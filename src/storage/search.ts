import { Dropbox, files } from "dropbox";
import * as dotenv from "dotenv";
dotenv.config();

const dbx = new Dropbox({
  clientId: process.env.DROPBOX_ID,
  clientSecret: process.env.DROPBOX_SECRET,
  refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
});

export const fetchPathDisplays = async (
  fileName: string,
  pathName: string
): Promise<string[] | null> => {
  const metaData = await fetchFileMetadata(fileName, pathName);
  if (metaData === null) return null;

  const pathDisplays = metaData
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
  return value !== null && typeof value === "object" && "metadata" in value;
};
