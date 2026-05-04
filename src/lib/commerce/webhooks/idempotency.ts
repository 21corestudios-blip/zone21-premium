import { createHash } from "node:crypto";

import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import type { StoredWebhookEvent } from "@/lib/commerce/persistence/types";

export function hashWebhookPayload(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

export function buildWebhookIdempotencyKey({
  provider,
  eventId,
}: {
  provider: StoredWebhookEvent["provider"];
  eventId: string;
}) {
  return `webhook:${provider}:${eventId}`;
}

export async function persistIncomingWebhookEvent({
  provider,
  eventId,
  eventType,
  payload,
  payloadJson,
}: {
  provider: StoredWebhookEvent["provider"];
  eventId: string;
  eventType: string;
  payload: string;
  payloadJson: unknown;
}) {
  return getCommerceRepository().persistWebhookEvent({
    provider,
    eventId,
    eventType,
    payloadHash: hashWebhookPayload(payload),
    payloadJson,
    idempotencyKey: buildWebhookIdempotencyKey({ provider, eventId }),
  });
}
