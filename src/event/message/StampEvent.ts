import { Message, APIEmbedAuthor } from 'discord.js';
import IMessageEvent from './IMessageEvent.js';
import fetchFileLinks from '../../storage/fetchFileLinks.js';
import { sendImageToChannel } from '../../send/sendImageToChannel.js';
import DatabaseClient from '../../model/DatabaseClient.js';

// メッセージを検知する度にStampEventクラスが初期化される
// DatabaseClientクラスの多重初期化を避けるためStampEventクラス外で初期化
const client = new DatabaseClient();

/**
 * Discord スタンプ(絵文字)利用された場合のイベント
 */
export default class StampEvent implements IMessageEvent {
  /**
   * メッセージがスタンプであるかを判定する
   * @param message メッセージ
   * @returns スタンプ判定
   */
  public isTargetEvent(message: Readonly<Message>): boolean {
    return /^<:(.+):(.+)>$/.test(message.content);
  }

  public async launchEvent(message: Readonly<Message>): Promise<void> {
    try {
      // Dropbox からスタンプ画像のリンクを取得してくる
      const stampName = this.toStampName(message);
      const imageLinks = await fetchFileLinks(stampName, `/${message.guildId}`);
      if (imageLinks.length === 0)
        throw new Error(`Failed get file links. => ${stampName}`);

      // Discord で利用されたメッセージ絵文字を削除する
      await message.delete();

      // Discord にスタンプ画像を送信
      await sendImageToChannel(imageLinks, message.channel, {
        author: this.toAutorEmbed(message),
      });

      // 結果をDBに保存する
      client.StorageStampLog.insertRecord({
        channelId: message.channelId,
        guildId: message.guildId,
        messageId: message.id,
        userId: message.author.id,
        userName: message.author.username,
        stampName,
      });
    } catch (e: any) {
      console.error(e);
    }
  }

  /**
   * メッセージからスタンプ名を抽出する
   * @param message メッセージ
   * @returns スタンプ名
   */
  private toStampName(message: Readonly<Message>): string {
    const match = message.content.match(/:(.+):/);
    if (match === null)
      throw new Error(`Failed match stamp name. => ${message.content}`);
    return match[0].replaceAll(':', '');
  }

  /**
   * メッセージ送信時のユーザーアイコンと名前を設定する
   * @param message
   * @returns
   */
  private toAutorEmbed(message: Readonly<Message>): APIEmbedAuthor {
    const discordAppIconUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
    const userName = message.member?.nickname || message.author.username;
    const userIcon = message.author.avatarURL() || discordAppIconUrl;
    return {
      name: userName,
      icon_url: userIcon,
    };
  }
}
