import type { RdmRecord } from "@/lib/rdm-types";

// Le RDM officiel est lu depuis Drive. Ce tableau reste vide pour éviter
// toute source applicative autonome ou reprise implicite d'anciens documents.
export const rdmRecords: RdmRecord[] = [];
