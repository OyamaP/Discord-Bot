import { ENV } from '../type.ts';

export type Option = {
  use_env_variable: EnvVariable;
  logging: boolean;
  timezone: string;
};

export type EnvVariable =
  | 'CONNECTION_URI_LOCAL'
  | 'CONNECTION_URI_DEV'
  | 'CONNECTION_URI_PROD';

export type SequelizeConfig = Record<ENV, Option>;

export declare module './config.js' {
  const config: SequelizeConfig;
  export default config;
}
