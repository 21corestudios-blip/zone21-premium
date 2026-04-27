export const ENV: string = process.env.NODE_ENV ?? "development";
export const WRITER_ENABLED = process.env.WRITER_ENABLED === "true";
export const WRITER_ENV_ALLOWED = ENV === "staging";
export const WRITER_REAL_EXECUTION_CONFIRMED =
  process.env.WRITER_REAL_EXECUTION_CONFIRMED === "true";
export const PHASE_2_ENABLED = process.env.PHASE_2_ENABLED === "true";

export interface WriterRuntimeConfig {
  env: string;
  writerEnabled: boolean;
  writerEnvAllowed: boolean;
  writerRealExecutionConfirmed: boolean;
  phase2Enabled: boolean;
}

export function getWriterRuntimeConfig(): WriterRuntimeConfig {
  const env: string = process.env.NODE_ENV ?? "development";

  return {
    env,
    writerEnabled: process.env.WRITER_ENABLED === "true",
    writerEnvAllowed: env === "staging",
    writerRealExecutionConfirmed:
      process.env.WRITER_REAL_EXECUTION_CONFIRMED === "true",
    phase2Enabled: process.env.PHASE_2_ENABLED === "true",
  };
}
