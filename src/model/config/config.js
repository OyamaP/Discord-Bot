// sequelize-cli ではTSをサポートしていないためJSファイルで記述する必要がある。
// sequelize-cli でmigration, seed の実行をするためにconfigを読み取っている。
// またModelからのアクセスにもconfigを利用DBにアクセスしており、最終ビルドファイルにも含まれる。
// 注意点としてts-jest 実行時に以下の設定がないと本configファイルをimport する際にエラーとなる
// - tsconfig.json => compilerOptions.allowJs をtrue にする
// - jest.config.cjs => transform の対象にjs を含める

/** @type {import("./config.d.ts")} */
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
