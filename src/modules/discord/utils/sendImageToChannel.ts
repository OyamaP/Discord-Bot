import {
  DMChannel,
  PartialDMChannel,
  NewsChannel,
  TextChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  VoiceChannel,
  APIEmbedAuthor,
} from "discord.js";

type Channel =
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | TextChannel
  | PrivateThreadChannel
  | PublicThreadChannel
  | VoiceChannel;
export type SendImageOption = {
  author?: APIEmbedAuthor;
};
/**
 * Discord チャンネルに画像を送信する
 * @param message
 */
export async function sendImageToChannel(
  imageLinks: string[],
  channel: Channel,
  option?: SendImageOption
): Promise<void> {
  const embeds = imageLinks.map((imageLink) => {
    return {
      author: option?.author,
      image: { url: imageLink },
    };
  });
  try {
    channel.send({ embeds });
  } catch (e: any) {
    throw e;
  }
}
