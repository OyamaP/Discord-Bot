import { BigString, Bot, DiscordEmbedAuthor } from "discord";

/**
 * Discord チャンネルに画像を送信する
 * @param message
 */
export async function sendImageToChannel(
  bot: Readonly<Bot>,
  channelId: BigString,
  imageLinks: ReadonlyArray<string>,
  option?: Readonly<{ author?: DiscordEmbedAuthor }>,
): Promise<void> {
  const embeds = imageLinks.map((imageLink) => ({
    author: option?.author,
    image: { url: imageLink },
  }));

  try {
    await bot.helpers.sendMessage(channelId, { embeds });
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
