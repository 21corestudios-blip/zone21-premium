import type { CommerceOrder } from "@/lib/commerce/orders/types";
import type { CommerceBrandId, FulfillmentProvider } from "@/lib/commerce/types";

export type WebhookProcessingStatus =
  | "pending"
  | "processing"
  | "processed"
  | "failed"
  | "ignored";

export interface StoredWebhookEvent {
  id: string;
  provider: "stripe" | "printify" | "gelato";
  eventId: string;
  eventType: string;
  payloadHash: string;
  payloadJson: unknown;
  receivedAt: string;
  processedAt?: string | null;
  processingStatus: WebhookProcessingStatus;
  errorMessage?: string | null;
  idempotencyKey: string;
}

export interface PersistWebhookEventInput {
  provider: StoredWebhookEvent["provider"];
  eventId: string;
  eventType: string;
  payloadHash: string;
  payloadJson: unknown;
  idempotencyKey: string;
}

export interface PersistWebhookEventResult {
  event: StoredWebhookEvent;
  duplicate: boolean;
}

export interface ProviderProductMapping {
  id: string;
  brand: CommerceBrandId;
  internalProductId: string;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  providerProductId: string;
  providerVariantId?: string | null;
  providerShopId?: string | null;
  providerRegion: string;
  currency: string;
  active: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProviderVariantMapping {
  id: string;
  productMappingId: string;
  internalProductId: string;
  internalVariantId: string;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  providerProductId: string;
  providerVariantId: string;
  sku?: string | null;
  active: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProviderMappingBundle {
  productMapping: ProviderProductMapping;
  variantMapping: ProviderVariantMapping;
}

export interface StripeTransferRecord {
  id: string;
  orderId: string;
  brand: CommerceBrandId;
  stripeTransferId?: string | null;
  destinationAccount?: string | null;
  amount: number;
  currency: string;
  status: "pending" | "transferred" | "failed" | "skipped";
  attemptCount: number;
  failureReason?: string | null;
  idempotencyKey: string;
}

export interface ProviderOrderRecord {
  id: string;
  orderId: string;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  providerOrderId?: string | null;
  status: "pending" | "submitted" | "failed" | "skipped";
  trackingJson?: unknown;
  rawResponseJson?: unknown;
  idempotencyKey: string;
}

export interface FulfillmentAttemptRecord {
  id: string;
  orderId: string;
  orderItemId?: string | null;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  status: "pending" | "submitted" | "failed" | "skipped";
  attemptCount: number;
  idempotencyKey: string;
  errorMessage?: string | null;
  rawRequestJson?: unknown;
  rawResponseJson?: unknown;
}

export interface CommerceRepository {
  saveOrder(order: CommerceOrder): Promise<CommerceOrder>;
  getOrder(orderId: string): Promise<CommerceOrder | null>;
  getOrderByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<CommerceOrder | null>;
  markOrderPaid(input: {
    orderId: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
  }): Promise<CommerceOrder | null>;
  persistWebhookEvent(
    input: PersistWebhookEventInput,
  ): Promise<PersistWebhookEventResult>;
  markWebhookEventStatus(input: {
    eventId: string;
    provider: StoredWebhookEvent["provider"];
    status: WebhookProcessingStatus;
    errorMessage?: string | null;
  }): Promise<void>;
  getProviderMapping(input: {
    productId: string;
    variantId: string;
    provider: Extract<FulfillmentProvider, "printify" | "gelato">;
    region?: string;
  }): Promise<ProviderMappingBundle | null>;
  recordStripeTransfer(
    record: StripeTransferRecord,
  ): Promise<StripeTransferRecord>;
  getStripeTransferByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<StripeTransferRecord | null>;
  recordProviderOrder(record: ProviderOrderRecord): Promise<ProviderOrderRecord>;
  getProviderOrderByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<ProviderOrderRecord | null>;
  recordFulfillmentAttempt(
    record: FulfillmentAttemptRecord,
  ): Promise<FulfillmentAttemptRecord>;
}
