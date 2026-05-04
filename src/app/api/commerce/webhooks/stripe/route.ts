import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import { handleCheckoutSessionCompleted } from "@/lib/commerce/post-payment/pipeline";
import { getStripeServerClient } from "@/lib/commerce/payments/stripe-connect";
import { persistIncomingWebhookEvent } from "@/lib/commerce/webhooks/idempotency";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET_NOT_CONFIGURED" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "STRIPE_SIGNATURE_MISSING" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripeServerClient().webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch {
    return NextResponse.json(
      { error: "STRIPE_SIGNATURE_INVALID" },
      { status: 400 },
    );
  }

  const repository = getCommerceRepository();
  const persistedEvent = await persistIncomingWebhookEvent({
    provider: "stripe",
    eventId: event.id,
    eventType: event.type,
    payload: body,
    payloadJson: event,
  });

  if (persistedEvent.duplicate) {
    return NextResponse.json({
      received: true,
      duplicate: true,
      status: persistedEvent.event.processingStatus,
    });
  }

  await repository.markWebhookEventStatus({
    provider: "stripe",
    eventId: event.id,
    status: "processing",
  });

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      await repository.markWebhookEventStatus({
        provider: "stripe",
        eventId: event.id,
        status: "processed",
      });
    } else if (
      event.type === "charge.refunded" ||
      event.type === "payment_intent.payment_failed"
    ) {
      await repository.markWebhookEventStatus({
        provider: "stripe",
        eventId: event.id,
        status: "processed",
      });
    } else {
      await repository.markWebhookEventStatus({
        provider: "stripe",
        eventId: event.id,
        status: "ignored",
      });
    }
  } catch (error) {
    await repository.markWebhookEventStatus({
      provider: "stripe",
      eventId: event.id,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "webhook failed",
    });

    return NextResponse.json(
      { error: "WEBHOOK_PROCESSING_FAILED" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
