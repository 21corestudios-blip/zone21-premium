"use client";

import { useSyncExternalStore } from "react";

export default function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
