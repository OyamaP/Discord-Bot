import "env";
import { Dropbox } from "dropbox";

const {
  DROPBOX_ID,
  DROPBOX_SECRET,
  DROPBOX_REFRESH_TOKEN,
} = Deno.env.toObject();

const initDropbox = () => {
  const dbx = new Dropbox({
    clientId: DROPBOX_ID,
    clientSecret: DROPBOX_SECRET,
    refreshToken: DROPBOX_REFRESH_TOKEN,
  });

  return dbx;
};

export default initDropbox;
