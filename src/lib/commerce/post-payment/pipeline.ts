import type Stripe from "stripe";

import {
  getOrder,
  getOrderByCheckoutSessionId,
  markOrderPaid,
  saveOrder,
} from "@/lib/commerce/orders/store";
import { createBrandTransfersForOrder } from "@/lib/commerce/payments/stripe-connect";
import { createWearProviderOrders } from "@/lib/commerce/fulfillment/wear-provider-orders";

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const orderId = session.metadata?.order_id;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const order =
    (orderId ? await getOrder(orderId) : null) ||
    (await getOrderByCheckoutSessionId(session.id));

  if (!order) {
    throw new Error("ORDER_NOT_FOUND_FOR_CHECKOUT_SESSION");
  }

  const paidOrder =
    (await markOrderPaid({
      orderId: order.orderId,
      paymentIntentId,
      checkoutSessionId: session.id,
    })) || order;

  await createBrandTransfersForOrder(paidOrder);
  await createWearProviderOrders(paidOrder);

  await saveOrder({
    ...paidOrder,
    statuses: {
      ...paidOrder.statuses,
      fulfillment: "submitted",
    },
    timestamps: {
      ...paidOrder.timestamps,
      updatedAt: new Date().toISOString(),
    },
  });
}
