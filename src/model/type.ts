export const ENV_STRINGS = ["local", "development", "production"] as const;
export type ENV = (typeof ENV_STRINGS)[number];
