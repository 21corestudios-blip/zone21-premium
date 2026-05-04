import type {
  CommerceBrandId,
  CommerceCartValidation,
  CommerceCustomer,
  CommerceMoney,
  FulfillmentProvider,
} from "@/lib/commerce/types";

export type TransferStatus = "pending" | "transferred" | "failed" | "skipped";
export type RefundStatus = "none" | "partial" | "refunded";
export type FulfillmentStatus =
  | "pending"
  | "submitted"
  | "in_production"
  | "shipped"
  | "failed";

export interface CommerceOrderLine {
  productId: string;
  variantId: string;
  brand: CommerceBrandId;
  quantity: number;
  unitAmount: CommerceMoney;
  grossAmount: CommerceMoney;
  platformFee: CommerceMoney;
  netAmount: CommerceMoney;
  transferStatus: TransferStatus;
  refundStatus: RefundStatus;
  fulfillmentProvider: FulfillmentProvider;
  fulfillmentStatus: FulfillmentStatus;
  providerMappingId?: string;
  providerOrderId?: string;
}

export interface CommerceOrder {
  orderId: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
  transferGroup: string;
  customer?: CommerceCustomer;
  items: CommerceOrderLine[];
  totals: {
    gross: CommerceMoney;
    platformFee: CommerceMoney;
    net: CommerceMoney;
  };
  statuses: {
    payment: "pending" | "paid" | "failed" | "refunded";
    fulfillment: FulfillmentStatus;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
}

export function createPendingOrderFromCart({
  cart,
  orderId,
  transferGroup,
  customer,
  platformFeeBps,
}: {
  cart: CommerceCartValidation;
  orderId: string;
  transferGroup: string;
  customer?: CommerceCustomer;
  platformFeeBps: number;
}): CommerceOrder {
  const now = new Date().toISOString();
  const items = cart.lines.map((line) => {
    const grossAmountCents =
      line.lineTotal?.amountCents ?? line.checkoutPrice.amountCents * line.quantity;
    const platformFeeCents = Math.round(
      (grossAmountCents * platformFeeBps) / 10000,
    );

    return {
      productId: line.productId,
      variantId: line.variantId,
      brand: line.brand,
      quantity: line.quantity,
      unitAmount: line.checkoutPrice,
      grossAmount: {
        amountCents: grossAmountCents,
        currency: line.currency,
      },
      platformFee: {
        amountCents: platformFeeCents,
        currency: line.currency,
      },
      netAmount: {
        amountCents: grossAmountCents - platformFeeCents,
        currency: line.currency,
      },
      transferStatus: "pending",
      refundStatus: "none",
      fulfillmentProvider: line.fulfillmentProvider,
      fulfillmentStatus: "pending",
      providerMappingId: line.providerMappingId,
    } satisfies CommerceOrderLine;
  });
  const platformFeeTotal = items.reduce(
    (sum, line) => sum + line.platformFee.amountCents,
    0,
  );

  return {
    orderId,
    transferGroup,
    customer,
    items,
    totals: {
      gross: cart.total,
      platformFee: {
        amountCents: platformFeeTotal,
        currency: cart.total.currency,
      },
      net: {
        amountCents: cart.total.amountCents - platformFeeTotal,
        currency: cart.total.currency,
      },
    },
    statuses: {
      payment: "pending",
      fulfillment: "pending",
    },
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
  };
}
