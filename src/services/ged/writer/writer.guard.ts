import {
  getWriterRuntimeConfig,
  type WriterRuntimeConfig,
} from "@/config/env.config";

export function assertWriterLocked(writerEnabled: boolean) {
  if (writerEnabled !== false) {
    throw new Error(
      "Writer GED verrouillé: toute activation du writer réel exige une modification explicite et revue.",
    );
  }

  return true as const;
}

export function isWriterActivationAllowed(
  runtimeConfig: WriterRuntimeConfig = getWriterRuntimeConfig(),
) {
  return runtimeConfig.writerEnabled && runtimeConfig.writerEnvAllowed &&
    runtimeConfig.env !== "production" &&
    runtimeConfig.writerRealExecutionConfirmed;
}

export function assertWriterActivationAllowed(
  runtimeConfig: WriterRuntimeConfig = getWriterRuntimeConfig(),
) {
  if (!runtimeConfig.writerEnabled) {
    throw new Error(
      "Activation writer refusée : WRITER_ENABLED=true est obligatoire.",
    );
  }

  if (runtimeConfig.env === "production") {
    throw new Error(
      "Activation writer refusée : aucune écriture réelle n'est autorisée en production.",
    );
  }

  if (!runtimeConfig.writerEnvAllowed) {
    throw new Error(
      "Activation writer refusée : l'environnement doit être strictement staging.",
    );
  }

  if (!runtimeConfig.writerRealExecutionConfirmed) {
    throw new Error(
      "Activation writer refusée : WRITER_REAL_EXECUTION_CONFIRMED=true est obligatoire.",
    );
  }

  return true as const;
}
