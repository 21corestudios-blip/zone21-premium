import Stripe from "stripe";

import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import type { StoredWebhookEvent } from "@/lib/commerce/persistence/types";
import { handleCheckoutSessionCompleted } from "@/lib/commerce/post-payment/pipeline";

export async function listPersistedWebhooks({
  provider = "stripe",
  status,
  limit = 20,
}: {
  provider?: StoredWebhookEvent["provider"];
  status?: StoredWebhookEvent["processingStatus"];
  limit?: number;
} = {}) {
  return getCommerceRepository().listWebhookEvents({ provider, status, limit });
}

export async function replayPersistedWebhook({
  provider = "stripe",
  eventId,
  force = false,
}: {
  provider?: StoredWebhookEvent["provider"];
  eventId: string;
  force?: boolean;
}) {
  assertReplayAllowed();

  const repository = getCommerceRepository();
  const event = await repository.getWebhookEvent({ provider, eventId });

  if (!event) {
    throw new Error("WEBHOOK_EVENT_NOT_FOUND");
  }

  if (
    event.processingStatus === "processed" &&
    !force
  ) {
    return {
      eventId: event.eventId,
      status: event.processingStatus,
      replayed: false,
      reason: "already processed; pass --force to replay through idempotent handlers",
    };
  }

  await repository.markWebhookEventStatus({
    provider,
    eventId,
    status: "processing",
    errorMessage: null,
  });

  try {
    await processStoredWebhookEvent(event);
    await repository.markWebhookEventStatus({
      provider,
      eventId,
      status: "processed",
      errorMessage: null,
    });

    return {
      eventId: event.eventId,
      status: "processed",
      replayed: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "WEBHOOK_REPLAY_FAILED";
    await repository.markWebhookEventStatus({
      provider,
      eventId,
      status: "failed",
      errorMessage: message,
    });
    throw error;
  }
}

function assertReplayAllowed() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.COMMERCE_ADMIN_REPLAY_ENABLED !== "true"
  ) {
    throw new Error("WEBHOOK_REPLAY_DISABLED_IN_PRODUCTION");
  }
}

async function processStoredWebhookEvent(event: StoredWebhookEvent) {
  if (event.provider !== "stripe") {
    throw new Error(`WEBHOOK_PROVIDER_REPLAY_UNSUPPORTED:${event.provider}`);
  }

  const stripeEvent = event.payloadJson as Stripe.Event;

  if (event.eventType === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(
      stripeEvent.data.object as Stripe.Checkout.Session,
    );
    return;
  }

  if (
    event.eventType === "charge.refunded" ||
    event.eventType === "payment_intent.payment_failed"
  ) {
    return;
  }

  throw new Error(`WEBHOOK_EVENT_TYPE_REPLAY_UNSUPPORTED:${event.eventType}`);
}
