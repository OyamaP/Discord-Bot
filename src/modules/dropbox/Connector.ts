import { Dropbox, DropboxOptions } from "dropbox";
import * as dotenv from "dotenv";
dotenv.config();
const { DROPBOX_ID, DROPBOX_SECRET, DROPBOX_REFRESH_TOKEN } = process.env;

const options: DropboxOptions = {
  clientId: DROPBOX_ID,
  clientSecret: DROPBOX_SECRET,
  refreshToken: DROPBOX_REFRESH_TOKEN,
};

/**
 * Dropbox 接続用クラス
 */
export default class Connector {
  private _dbx: Dropbox;

  constructor(dbx?: Dropbox) {
    this._dbx = dbx || new Dropbox(options);
  }

  get dbx() {
    return this._dbx;
  }
}
