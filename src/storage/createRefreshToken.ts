import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Dropbox API V2 で利用するRefreshToken を取得する単体コード
 */

const options = {
  method: 'POST',
  url: 'https://api.dropbox.com/oauth2/token',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  data: {
    client_id: process.env.DROPBOX_ID,
    client_secret: process.env.DROPBOX_SECRET,
    code: process.env.DROPBOX_ACCESS_CODE,
    grant_type: 'authorization_code',
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
