import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

import type { CommerceOrder } from "@/lib/commerce/orders/types";
import type {
  CommerceRepository,
  FulfillmentAttemptRecord,
  PersistWebhookEventInput,
  PersistWebhookEventResult,
  ProviderMappingBundle,
  ProviderOrderRecord,
  ProviderProductMapping,
  ProviderVariantMapping,
  StoredWebhookEvent,
  StripeTransferRecord,
  WebhookProcessingStatus,
} from "@/lib/commerce/persistence/types";
import { firstRow, fromJson, toJson } from "./json-codec";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for MySQL commerce persistence.");
  }

  pool ??= mysql.createPool(process.env.DATABASE_URL);
  return pool;
}

type OrderRow = RowDataPacket & {
  id: string;
  raw_json: unknown;
  checkout_session_id: string | null;
  payment_intent_id: string | null;
};

type WebhookRow = RowDataPacket & {
  provider: StoredWebhookEvent["provider"];
  event_id: string;
  event_type: string;
  payload_hash: string;
  payload_json: unknown;
  received_at: Date;
  processed_at: Date | null;
  processing_status: WebhookProcessingStatus;
  error_message: string | null;
  idempotency_key: string;
};

type ProductMappingRow = RowDataPacket & {
  id: string;
  brand: ProviderProductMapping["brand"];
  internal_product_id: string;
  provider: ProviderProductMapping["provider"];
  provider_product_id: string;
  provider_variant_id: string | null;
  provider_shop_id: string | null;
  provider_region: string;
  currency: string;
  active: 0 | 1;
  metadata_json: unknown;
};

type VariantMappingRow = RowDataPacket & {
  id: string;
  product_mapping_id: string;
  internal_product_id: string;
  internal_variant_id: string;
  provider: ProviderVariantMapping["provider"];
  provider_product_id: string;
  provider_variant_id: string;
  sku: string | null;
  active: 0 | 1;
  metadata_json: unknown;
};

type StripeTransferRow = RowDataPacket & StripeTransferRecord;
type ProviderOrderRow = RowDataPacket & ProviderOrderRecord;

export class MySqlCommerceRepository implements CommerceRepository {
  private get db() {
    return getPool();
  }

  async saveOrder(order: CommerceOrder) {
    await this.db.execute(
      `INSERT INTO orders
        (id, customer_email, status, payment_status, payment_intent_id,
         checkout_session_id, transfer_group, currency, subtotal_amount,
         shipping_amount, total_amount, platform_fee_amount, raw_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         customer_email = VALUES(customer_email),
         status = VALUES(status),
         payment_status = VALUES(payment_status),
         payment_intent_id = VALUES(payment_intent_id),
         checkout_session_id = VALUES(checkout_session_id),
         transfer_group = VALUES(transfer_group),
         currency = VALUES(currency),
         subtotal_amount = VALUES(subtotal_amount),
         shipping_amount = VALUES(shipping_amount),
         total_amount = VALUES(total_amount),
         platform_fee_amount = VALUES(platform_fee_amount),
         raw_json = VALUES(raw_json)`,
      [
        order.orderId,
        order.customer?.email || null,
        order.statuses.fulfillment,
        order.statuses.payment,
        order.paymentIntentId || null,
        order.checkoutSessionId || null,
        order.transferGroup,
        order.totals.gross.currency,
        order.totals.gross.amountCents,
        0,
        order.totals.gross.amountCents,
        order.totals.platformFee.amountCents,
        toJson(order),
      ],
    );

    for (const item of order.items) {
      const itemId = `${order.orderId}:${item.productId}:${item.variantId}`;
      await this.db.execute(
        `INSERT INTO order_items
          (id, order_id, product_id, variant_id, brand, source,
           fulfillment_provider, quantity, unit_amount, gross_amount,
           shipping_amount, platform_fee_amount, net_amount, transfer_status,
           refund_status, provider_mapping_id, provider_order_id, raw_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           quantity = VALUES(quantity),
           gross_amount = VALUES(gross_amount),
           platform_fee_amount = VALUES(platform_fee_amount),
           net_amount = VALUES(net_amount),
           transfer_status = VALUES(transfer_status),
           refund_status = VALUES(refund_status),
           provider_mapping_id = VALUES(provider_mapping_id),
           provider_order_id = VALUES(provider_order_id),
           raw_json = VALUES(raw_json)`,
        [
          itemId,
          order.orderId,
          item.productId,
          item.variantId,
          item.brand,
          "internal",
          item.fulfillmentProvider,
          item.quantity,
          item.unitAmount.amountCents,
          item.grossAmount.amountCents,
          0,
          item.platformFee.amountCents,
          item.netAmount.amountCents,
          item.transferStatus,
          item.refundStatus,
          item.providerMappingId || null,
          item.providerOrderId || null,
          toJson(item),
        ],
      );
    }

    return order;
  }

  async getOrder(orderId: string) {
    const [rows] = await this.db.execute<OrderRow[]>(
      "SELECT raw_json FROM orders WHERE id = ? LIMIT 1",
      [orderId],
    );
    const row = firstRow(rows);
    return row ? fromJson<CommerceOrder>(row.raw_json, null as never) : null;
  }

  async getOrderByCheckoutSessionId(checkoutSessionId: string) {
    const [rows] = await this.db.execute<OrderRow[]>(
      "SELECT raw_json FROM orders WHERE checkout_session_id = ? LIMIT 1",
      [checkoutSessionId],
    );
    const row = firstRow(rows);
    return row ? fromJson<CommerceOrder>(row.raw_json, null as never) : null;
  }

  async markOrderPaid(input: {
    orderId: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
  }) {
    const order = await this.getOrder(input.orderId);

    if (!order) {
      return null;
    }

    const updatedOrder: CommerceOrder = {
      ...order,
      paymentIntentId: input.paymentIntentId || order.paymentIntentId,
      checkoutSessionId: input.checkoutSessionId || order.checkoutSessionId,
      statuses: { ...order.statuses, payment: "paid" },
      timestamps: { ...order.timestamps, updatedAt: new Date().toISOString() },
    };

    await this.saveOrder(updatedOrder);
    return updatedOrder;
  }

  async persistWebhookEvent(
    input: PersistWebhookEventInput,
  ): Promise<PersistWebhookEventResult> {
    const [existingRows] = await this.db.execute<WebhookRow[]>(
      "SELECT * FROM webhook_events WHERE provider = ? AND event_id = ? LIMIT 1",
      [input.provider, input.eventId],
    );
    const existing = firstRow(existingRows);

    if (existing) {
      return { event: mapWebhookRow(existing), duplicate: true };
    }

    await this.db.execute(
      `INSERT INTO webhook_events
        (id, provider, event_id, event_type, payload_hash, payload_json,
         processing_status, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `${input.provider}:${input.eventId}`,
        input.provider,
        input.eventId,
        input.eventType,
        input.payloadHash,
        toJson(input.payloadJson),
        "pending",
        input.idempotencyKey,
      ],
    );

    const [rows] = await this.db.execute<WebhookRow[]>(
      "SELECT * FROM webhook_events WHERE provider = ? AND event_id = ? LIMIT 1",
      [input.provider, input.eventId],
    );
    return { event: mapWebhookRow(firstRow(rows)!), duplicate: false };
  }

  async markWebhookEventStatus(input: {
    eventId: string;
    provider: StoredWebhookEvent["provider"];
    status: WebhookProcessingStatus;
    errorMessage?: string | null;
  }) {
    await this.db.execute(
      `UPDATE webhook_events
       SET processing_status = ?,
           error_message = ?,
           processed_at = CASE WHEN ? IN ('processed','failed','ignored') THEN NOW() ELSE processed_at END
       WHERE provider = ? AND event_id = ?`,
      [
        input.status,
        input.errorMessage || null,
        input.status,
        input.provider,
        input.eventId,
      ],
    );
  }

  async getProviderMapping(input: {
    productId: string;
    variantId: string;
    provider: ProviderMappingBundle["productMapping"]["provider"];
    region?: string;
  }) {
    const [productRows] = await this.db.execute<ProductMappingRow[]>(
      `SELECT * FROM provider_product_mappings
       WHERE internal_product_id = ? AND provider = ? AND active = TRUE
       ${input.region ? "AND provider_region = ?" : ""}
       LIMIT 1`,
      input.region
        ? [input.productId, input.provider, input.region]
        : [input.productId, input.provider],
    );
    const productRow = firstRow(productRows);

    if (!productRow) {
      return null;
    }

    const [variantRows] = await this.db.execute<VariantMappingRow[]>(
      `SELECT * FROM provider_variant_mappings
       WHERE product_mapping_id = ? AND internal_variant_id = ? AND active = TRUE
       LIMIT 1`,
      [productRow.id, input.variantId],
    );
    const variantRow = firstRow(variantRows);

    return variantRow
      ? {
          productMapping: mapProductMappingRow(productRow),
          variantMapping: mapVariantMappingRow(variantRow),
        }
      : null;
  }

  async recordStripeTransfer(record: StripeTransferRecord) {
    await this.db.execute(
      `INSERT INTO stripe_transfers
        (id, order_id, brand, stripe_transfer_id, destination_account, amount,
         currency, status, attempt_count, failure_reason, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         stripe_transfer_id = VALUES(stripe_transfer_id),
         destination_account = VALUES(destination_account),
         status = VALUES(status),
         attempt_count = attempt_count + 1,
         failure_reason = VALUES(failure_reason)`,
      [
        record.id,
        record.orderId,
        record.brand,
        record.stripeTransferId || null,
        record.destinationAccount || null,
        record.amount,
        record.currency,
        record.status,
        record.attemptCount,
        record.failureReason || null,
        record.idempotencyKey,
      ],
    );
    return record;
  }

  async getStripeTransferByIdempotencyKey(idempotencyKey: string) {
    const [rows] = await this.db.execute<StripeTransferRow[]>(
      "SELECT * FROM stripe_transfers WHERE idempotency_key = ? LIMIT 1",
      [idempotencyKey],
    );
    return firstRow(rows) || null;
  }

  async recordProviderOrder(record: ProviderOrderRecord) {
    await this.db.execute(
      `INSERT INTO provider_orders
        (id, order_id, provider, provider_order_id, status, tracking_json,
         raw_response_json, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         provider_order_id = VALUES(provider_order_id),
         status = VALUES(status),
         tracking_json = VALUES(tracking_json),
         raw_response_json = VALUES(raw_response_json)`,
      [
        record.id,
        record.orderId,
        record.provider,
        record.providerOrderId || null,
        record.status,
        toJson(record.trackingJson || null),
        toJson(record.rawResponseJson || null),
        record.idempotencyKey,
      ],
    );
    return record;
  }

  async getProviderOrderByIdempotencyKey(idempotencyKey: string) {
    const [rows] = await this.db.execute<ProviderOrderRow[]>(
      "SELECT * FROM provider_orders WHERE idempotency_key = ? LIMIT 1",
      [idempotencyKey],
    );
    return firstRow(rows) || null;
  }

  async recordFulfillmentAttempt(record: FulfillmentAttemptRecord) {
    await this.db.execute(
      `INSERT INTO fulfillment_attempts
        (id, order_id, order_item_id, provider, status, attempt_count,
         idempotency_key, error_message, raw_request_json, raw_response_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         attempt_count = attempt_count + 1,
         error_message = VALUES(error_message),
         raw_request_json = VALUES(raw_request_json),
         raw_response_json = VALUES(raw_response_json)`,
      [
        record.id,
        record.orderId,
        record.orderItemId || null,
        record.provider,
        record.status,
        record.attemptCount,
        record.idempotencyKey,
        record.errorMessage || null,
        toJson(record.rawRequestJson || null),
        toJson(record.rawResponseJson || null),
      ],
    );
    return record;
  }
}

function mapWebhookRow(row: WebhookRow): StoredWebhookEvent {
  return {
    id: `${row.provider}:${row.event_id}`,
    provider: row.provider,
    eventId: row.event_id,
    eventType: row.event_type,
    payloadHash: row.payload_hash,
    payloadJson: fromJson(row.payload_json, {}),
    receivedAt: row.received_at.toISOString(),
    processedAt: row.processed_at?.toISOString() || null,
    processingStatus: row.processing_status,
    errorMessage: row.error_message,
    idempotencyKey: row.idempotency_key,
  };
}

function mapProductMappingRow(row: ProductMappingRow): ProviderProductMapping {
  return {
    id: row.id,
    brand: row.brand,
    internalProductId: row.internal_product_id,
    provider: row.provider,
    providerProductId: row.provider_product_id,
    providerVariantId: row.provider_variant_id,
    providerShopId: row.provider_shop_id,
    providerRegion: row.provider_region,
    currency: row.currency,
    active: Boolean(row.active),
    metadata: fromJson(row.metadata_json, {}),
  };
}

function mapVariantMappingRow(row: VariantMappingRow): ProviderVariantMapping {
  return {
    id: row.id,
    productMappingId: row.product_mapping_id,
    internalProductId: row.internal_product_id,
    internalVariantId: row.internal_variant_id,
    provider: row.provider,
    providerProductId: row.provider_product_id,
    providerVariantId: row.provider_variant_id,
    sku: row.sku,
    active: Boolean(row.active),
    metadata: fromJson(row.metadata_json, {}),
  };
}
