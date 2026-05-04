import Stripe from "stripe";

import type { CommerceCartValidation } from "@/lib/commerce/types";

export const stripeApiVersion = Stripe.API_VERSION;

export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey, {
    apiVersion: stripeApiVersion,
  });
}

export function getConnectedAccountForBrand(brand: string) {
  const envKey = `STRIPE_CONNECT_ACCOUNT_${brand.toUpperCase()}`;
  return process.env[envKey];
}

export function getPlatformFeeBps() {
  const rawValue = process.env.STRIPE_PLATFORM_FEE_BPS || "1200";
  const parsed = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsed) ? parsed : 1200;
}

export function buildTransferGroup(orderId: string) {
  return `z21_order_${orderId}`;
}

export function computeBrandShares(cart: CommerceCartValidation) {
  const platformFeeBps = getPlatformFeeBps();

  return cart.brandSubtotals.map((subtotal) => {
    const platformFee = Math.round((subtotal.amountCents * platformFeeBps) / 10000);

    return {
      brand: subtotal.brand,
      grossAmount: subtotal.amountCents,
      platformFee,
      netAmount: subtotal.amountCents - platformFee,
      connectedAccountId: getConnectedAccountForBrand(subtotal.brand),
    };
  });
}

export async function createGlobalCheckoutSession({
  cart,
  orderId,
  successUrl,
  cancelUrl,
}: {
  cart: CommerceCartValidation;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeServerClient();
  const transferGroup = buildTransferGroup(orderId);
  const brandShares = computeBrandShares(cart);

  return stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: cart.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: line.currency.toLowerCase(),
        unit_amount: line.checkoutPrice.amountCents,
        product_data: {
          name: String(line.metadata.productTitle || line.productId),
          metadata: {
            product_id: line.productId,
            variant_id: line.variantId,
            brand: line.brand,
          },
        },
      },
    })),
    payment_intent_data: {
      transfer_group: transferGroup,
      metadata: {
        order_id: orderId,
        transfer_group: transferGroup,
        brand_shares: JSON.stringify(brandShares).slice(0, 500),
      },
    },
    metadata: {
      order_id: orderId,
      transfer_group: transferGroup,
    },
  });
}
