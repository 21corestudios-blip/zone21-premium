export function assertWriterLocked(writerEnabled: boolean) {
  if (writerEnabled !== false) {
    throw new Error(
      "Writer GED verrouillé: toute activation du writer réel exige une modification explicite et revue.",
    );
  }

  return true as const;
}
