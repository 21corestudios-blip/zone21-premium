export const ENV: string = process.env.NODE_ENV ?? "development";
export const WRITER_ENABLED = process.env.WRITER_ENABLED === "true";
export const WRITER_ENV_ALLOWED = ENV === "staging";

export interface WriterRuntimeConfig {
  env: string;
  writerEnabled: boolean;
  writerEnvAllowed: boolean;
}

export function getWriterRuntimeConfig(): WriterRuntimeConfig {
  const env: string = process.env.NODE_ENV ?? "development";

  return {
    env,
    writerEnabled: process.env.WRITER_ENABLED === "true",
    writerEnvAllowed: env === "staging",
  };
}
