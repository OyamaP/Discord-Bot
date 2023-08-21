import { ENV } from "../type.ts";

declare const config: Record<ENV, Option>;

type Option = {
  use_env_variable: EnvVariable;
  logging: boolean;
  timezone: string;
};

type EnvVariable =
  | "CONNECTION_URI_LOCAL"
  | "CONNECTION_URI_DEV"
  | "CONNECTION_URI_PROD";

export default config;
