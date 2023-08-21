import axios from "axios";

/**
 * Dropbox API V2 で利用するRefreshToken を取得する単体コード
 */

try {
  const response = await axios({
    method: "POST",
    url: "https://api.dropbox.com/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      client_id: Deno.env.get("DROPBOX_ID"),
      client_secret: Deno.env.get("DROPBOX_SECRET"),
      code: Deno.env.get("DROPBOX_ACCESS_CODE"),
      grant_type: "authorization_code",
    },
  });
  console.log(response.data);
} catch (e: any) {
  console.error(e);
}
