import {
  Channel,
  CategoryChannel,
  PartialGroupDMChannel,
  StageChannel,
  ForumChannel,
  APIEmbedAuthor,
} from 'discord.js';

/**
 * send()実行可能なチャンネル
 */
export type SendingExecutableChannel = Exclude<
  Channel,
  CategoryChannel | PartialGroupDMChannel | StageChannel | ForumChannel
>;

/**
 * send()実行可能なチャンネルか判定する型ガード
 * @param channel
 * @returns
 */
export function isSendingExecutableChannel(
  channel: Readonly<Channel>
): channel is SendingExecutableChannel {
  return 'send' in channel;
}

/**
 * Discord チャンネルに画像を送信する
 * @param message
 */
export async function sendImageToChannel(
  imageLinks: readonly string[],
  channel: Readonly<SendingExecutableChannel>,
  option?: Readonly<{ author?: APIEmbedAuthor }>
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
    console.error(e);
    throw e;
  }
}
