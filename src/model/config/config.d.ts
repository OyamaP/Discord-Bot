type ENV = 'local' | 'development' | 'production';

type Option = {
  use_env_variable: string;
  logging: boolean;
  timezone: string;
};

type SequelizeConfig = Record<ENV, Option>;

export declare module './config.js' {
  const config: Config;
  export default config;
}
