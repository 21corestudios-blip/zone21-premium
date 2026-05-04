import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { markOrderPaid } from "@/lib/commerce/orders/store";
import { getStripeServerClient } from "@/lib/commerce/payments/stripe-connect";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (orderId) {
      await markOrderPaid({
        orderId,
        paymentIntentId,
        checkoutSessionId: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
