import Stripe from "stripe";

import type { CommerceOrder } from "@/lib/commerce/orders/types";
import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
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

export function buildStripeIdempotencyKey(parts: string[]) {
  return ["z21", ...parts].join(":").replace(/[^a-zA-Z0-9:_-]/g, "_");
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

  return stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: cart.lines.map((line) => ({
      quantity: line.lineTotal ? 1 : line.quantity,
      price_data: {
        currency: line.currency.toLowerCase(),
        unit_amount: line.lineTotal?.amountCents ?? line.checkoutPrice.amountCents,
        product_data: {
          name: line.lineTotal
            ? `${String(line.metadata.productTitle || line.productId)} x${line.quantity}`
            : String(line.metadata.productTitle || line.productId),
          metadata: {
            product_id: line.productId,
            variant_id: line.variantId,
            brand: line.brand,
            provider_mapping_id: line.providerMappingId || "",
          },
        },
      },
    })),
    payment_intent_data: {
      transfer_group: transferGroup,
      metadata: {
        order_id: orderId,
        transfer_group: transferGroup,
      },
    },
    metadata: {
      order_id: orderId,
      transfer_group: transferGroup,
    },
  }, {
    idempotencyKey: buildStripeIdempotencyKey(["checkout", orderId]),
  });
}

export async function createBrandTransfersForOrder(order: CommerceOrder) {
  const stripe = getStripeServerClient();
  const repository = getCommerceRepository();
  const grouped = new Map<
    string,
    {
      amount: number;
      currency: string;
      brand: CommerceOrder["items"][number]["brand"];
    }
  >();

  for (const item of order.items) {
    const existing = grouped.get(item.brand) || {
      amount: 0,
      currency: item.netAmount.currency,
      brand: item.brand,
    };
    existing.amount += item.netAmount.amountCents;
    grouped.set(item.brand, existing);
  }

  for (const share of grouped.values()) {
    const idempotencyKey = buildStripeIdempotencyKey([
      "transfer",
      order.orderId,
      share.brand,
    ]);
    const existing = await repository.getStripeTransferByIdempotencyKey(
      idempotencyKey,
    );

    if (existing?.status === "transferred") {
      continue;
    }

    const destination = getConnectedAccountForBrand(share.brand);

    if (!destination) {
      await repository.recordStripeTransfer({
        id: idempotencyKey,
        orderId: order.orderId,
        brand: share.brand,
        destinationAccount: null,
        amount: share.amount,
        currency: share.currency,
        status: "skipped",
        attemptCount: existing ? existing.attemptCount + 1 : 1,
        failureReason: "connected account not configured",
        idempotencyKey,
      });
      continue;
    }

    try {
      const transfer = await stripe.transfers.create(
        {
          amount: share.amount,
          currency: share.currency.toLowerCase(),
          destination,
          transfer_group: order.transferGroup,
          metadata: {
            order_id: order.orderId,
            brand: share.brand,
          },
        },
        { idempotencyKey },
      );

      await repository.recordStripeTransfer({
        id: idempotencyKey,
        orderId: order.orderId,
        brand: share.brand,
        stripeTransferId: transfer.id,
        destinationAccount: destination,
        amount: share.amount,
        currency: share.currency,
        status: "transferred",
        attemptCount: existing ? existing.attemptCount + 1 : 1,
        failureReason: null,
        idempotencyKey,
      });
    } catch (error) {
      await repository.recordStripeTransfer({
        id: idempotencyKey,
        orderId: order.orderId,
        brand: share.brand,
        destinationAccount: destination,
        amount: share.amount,
        currency: share.currency,
        status: "failed",
        attemptCount: existing ? existing.attemptCount + 1 : 1,
        failureReason: error instanceof Error ? error.message : "transfer failed",
        idempotencyKey,
      });
    }
  }
}
