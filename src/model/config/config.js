import * as dotenv from 'dotenv';
dotenv.config();

// sequelize-cli ではTSをサポートしていないためJSファイルで設定
// sequelize-cli は主にmigration, seed の実行で利用する
// またModelからのアクセスにも利用し最終ビルドファイルにも含まれる

export default {
  local: {
    use_env_variable: 'CONNECTION_URI_LOCAL',
    logging: false, // SQL実行時のconsole出力可否
    timezone: '+09:00', // created_at, updated_at
  },
  development: {
    use_env_variable: 'CONNECTION_URI_DEV',
    logging: false, // SQL実行時のconsole出力可否
    timezone: '+09:00', // created_at, updated_at
  },
  production: {
    use_env_variable: 'CONNECTION_URI_PROD',
    logging: false, // SQL実行時のconsole出力可否
    timezone: '+09:00', // created_at, updated_at
  },
};
