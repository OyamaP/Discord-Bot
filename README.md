# Discord Bot

## Flow

1. Botを配置したDiscordサーバーで指定のスタンプを使用
1. Bot動作中のサーバーでメッセージを受信
1. メッセージのスタンプ判定
    ```
    xxxxx = stampId
    nnnnn = randomNumber
    <:xxxxx:nnnnn>
    ```
1. Dropboxからファイルを一覧で取得
1. stampIdとファイル名の一致するファイルURLを取得
1. Discord の元メッセージ(スタンプ)を削除
1. Discord にDropboxの画像リンク送信

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
API追加, 権限変更した際に再度認証コードを発行する仕様となっているため、下記にアクセスして認証を行う
```
※ Dropbox App Id を {app_id} に置換してください
https://www.dropbox.com/oauth2/authorize?client_id={app_id}&response_type=code&token_access_type=offline
```
最後に表示される`アクセスコード`を`環境変数`の`DROPBOX_ACCESS_CODE`に設定する

## Get Refersh Token
※ PostManやThunderClientなどのツールでの送信も可

Dropbox`環境変数`が設定されていることを確認しコマンドを実行する
- DROPBOX_ID
- DROPBOX_SECRET
- DROPBOX_ACCESS_CODE
```
npm run refreshToken
```
コンソール表示されるresponse内の`refresh_token`を`環境変数`の`DROPBOX_REFRESH_TOKEN`に設定する

また`DROPBOX_ACCESS_CODE`は`refresh_token`を取得するための一時コードかつ時限性であるため動作環境では不要である

## Errors
```
error: {
  error_summary: 'missing_scope/...',
  error: { '.tag': 'missing_scope', required_scope: 'sharing.read' }
}
```
https://github.com/andreafabrizi/Dropbox-Uploader/issues/514#issuecomment-711345756  
permissionに未設定のままdropboxと連携すると、後で権限を変更しても反映されない(仕様？)  
一度dropboxのアプリ設定で解除(削除)して再度AuthorizationCodeの取得からやり直す必要があるため、最小権限で設定すると後で変更するのが面倒になる

## Windowsローカル運用
本Botをローカルで起動したままPCをスリープにすると当然Botも停止する  
夜は寝るまで利用するとして、朝スリープ解除するまで他のメンバーが使えないのはいただけない

以下windowsのスケジューラー登録用コマンドを[参考サイト](https://ishi-pc.net/colum/auto-sleep/)から流用

電源オプション->スリープ->スリープ解除タイマーの許可を有効にした上でbashなどで実行
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
