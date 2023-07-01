# 環境構築

## docker

マルチステージビルドを利用して最小限の構成にビルドしたイメージを作成します。

- 作成

```bash
docker build ./ -t discord-bot-build --build-arg BUILDKIT_INLINE_CACHE=1
```

- 起動
  ローカルでのビルド結果確認をする場合 env ファイルを読み込ませる必要あり

```bash
docker run -d -p 3000:3000 --name discord-bot-build --env-file ./.env discord-bot-build
```

## docker-compose

ローカルで開発用のコンテナを作成します。
初回など`node_modules `がない場合は自動でインストールされます。
2 回目以降の実行時にはインストール処理がされません。

```bash
docker-compose up -d
```

# Discord Bot

## Flow

1. Bot を配置した Discord サーバーで指定のスタンプを使用
1. Bot 動作中のサーバーでメッセージを受信
1. メッセージのスタンプ判定
   ```
   xxxxx = stampId
   nnnnn = randomNumber
   <:xxxxx:nnnnn>
   ```
1. Dropbox からファイルを一覧で取得
1. stampId とファイル名の一致するファイル URL を取得
1. Discord の元メッセージ(スタンプ)を削除
1. Discord に Dropbox の画像リンク送信

# Discord Api

## BOT Permissions

- Manage Messages

# Dropbox Api

## Permissions

- account_info.read
- files.metadata.read
- files.content.read
- sharing.write
- sharing.read
- file_requests.read

## Get AuthorizationCode

API 追加, 権限変更した際に再度認証コードを発行する仕様となっているため、下記にアクセスして認証を行う

```
※ Dropbox App Id を {app_id} に置換してください
https://www.dropbox.com/oauth2/authorize?client_id={app_id}&response_type=code&token_access_type=offline
```

最後に表示される`アクセスコード`を`環境変数`の`DROPBOX_ACCESS_CODE`に設定する

## Get Refersh Token

※ PostMan や ThunderClient などのツールでの送信も可

Dropbox`環境変数`が設定されていることを確認しコマンドを実行する

- DROPBOX_ID
- DROPBOX_SECRET
- DROPBOX_ACCESS_CODE

```
npm run refreshToken
```

コンソール表示される response 内の`refresh_token`を`環境変数`の`DROPBOX_REFRESH_TOKEN`に設定する

また`DROPBOX_ACCESS_CODE`は`refresh_token`を取得するための一時コードかつ時限性であるため動作環境では不要である

## Errors

```
error: {
  error_summary: 'missing_scope/...',
  error: { '.tag': 'missing_scope', required_scope: 'sharing.read' }
}
```

https://github.com/andreafabrizi/Dropbox-Uploader/issues/514#issuecomment-711345756  
permission に未設定のまま dropbox と連携すると、後で権限を変更しても反映されない(仕様？)  
一度 dropbox のアプリ設定で解除(削除)して再度 AuthorizationCode の取得からやり直す必要があるため、最小権限で設定すると後で変更するのが面倒になる

## Windows ローカル運用

本 Bot をローカルで起動したまま PC をスリープにすると当然 Bot も停止する  
夜は寝るまで利用するとして、朝スリープ解除するまで他のメンバーが使えないのはいただけない

以下 windows のスケジューラー登録用コマンドを[参考サイト](https://ishi-pc.net/colum/auto-sleep/)から流用

電源オプション->スリープ->スリープ解除タイマーの許可を有効にした上で bash などで実行

```bash
$script = '$signature = @"
[DllImport("powrprof.dll")]
public static extern bool SetSuspendState(bool Hibernate,bool ForceCritical,bool DisableWakeEvent);
"@
$func = Add-Type -memberDefinition $signature -namespace "Win32Functions" -name "SetSuspendStateFunction" -passThru
$func::SetSuspendState($false,$true,$false)'

$bytes = [System.Text.Encoding]::Unicode.GetBytes($script)
$encodedCommand = [Convert]::ToBase64String($bytes)

$action = New-ScheduledTaskAction -Execute "cmd.exe"
$settings = New-ScheduledTaskSettingsSet -WakeToRun
$trigger = New-ScheduledTaskTrigger -Daily -DaysInterval 1 -At 05:30
Register-ScheduledTask -TaskName "WakeUp" -Action $action -Settings $settings -Trigger $trigger -Force
```
