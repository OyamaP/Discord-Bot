import { ENV } from '../type.ts';

export type Option = {
  use_env_variable: string;
  logging: boolean;
  timezone: string;
};

export type SequelizeConfig = Record<ENV, Option>;

export declare module './config.js' {
  const config: SequelizeConfig;
  export default config;
}
