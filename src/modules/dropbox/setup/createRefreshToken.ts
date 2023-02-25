import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const { DROPBOX_ID, DROPBOX_SECRET, DROPBOX_ACCESS_CODE } = process.env;

/**
 * Dropbox API V2 で利用するRefreshToken を取得する単体コード
 */

const options = {
  method: "POST",
  url: "https://api.dropbox.com/oauth2/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  data: {
    client_id: DROPBOX_ID,
    client_secret: DROPBOX_SECRET,
    code: DROPBOX_ACCESS_CODE,
    grant_type: "authorization_code",
  },
};

axios
  .request(options)
  .then((response: any) => {
    console.log(response.data);
  })
  .catch((error: any) => {
    console.error(error);
  });
