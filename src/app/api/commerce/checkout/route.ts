import { NextResponse } from "next/server";

import { validateCommerceCart } from "@/lib/commerce/cart/validation";
import {
  buildTransferGroup,
  createGlobalCheckoutSession,
  getPlatformFeeBps,
} from "@/lib/commerce/payments/stripe-connect";
import {
  createPendingOrderFromCart,
  type CommerceOrder,
} from "@/lib/commerce/orders/types";
import { saveOrder } from "@/lib/commerce/orders/store";
import type { CommerceCustomer, CommerceLineInput } from "@/lib/commerce/types";

interface GlobalCheckoutRequestBody {
  items?: CommerceLineInput[];
  customer?: CommerceCustomer;
  successUrl?: string;
  cancelUrl?: string;
}

function createOrderId() {
  return `Z21-${Date.now().toString(36).toUpperCase()}`;
}

function getSiteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: GlobalCheckoutRequestBody;

  try {
    body = (await request.json()) as GlobalCheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: "CHECKOUT_PAYLOAD_INVALID" },
      { status: 400 },
    );
  }

  try {
    const cart = validateCommerceCart(body.items || []);
    const orderId = createOrderId();
    const transferGroup = buildTransferGroup(orderId);
    const order: CommerceOrder = createPendingOrderFromCart({
      cart,
      orderId,
      transferGroup,
      customer: body.customer,
      platformFeeBps: getPlatformFeeBps(),
    });
    const siteUrl = getSiteUrl(request);
    const session = await createGlobalCheckoutSession({
      cart,
      orderId,
      successUrl:
        body.successUrl || `${siteUrl}/wear/checkout/success?order=${orderId}`,
      cancelUrl: body.cancelUrl || `${siteUrl}/wear/checkout`,
    });

    await saveOrder({
      ...order,
      checkoutSessionId: session.id,
    });

    return NextResponse.json({
      orderId,
      checkoutSessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "CHECKOUT_CREATE_FAILED";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
