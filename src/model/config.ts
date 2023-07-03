import * as dotenv from 'dotenv';
dotenv.config();

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
