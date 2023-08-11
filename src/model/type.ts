export const envStrings = ['local', 'development', 'production'] as const;
export type ENV = (typeof envStrings)[number];
