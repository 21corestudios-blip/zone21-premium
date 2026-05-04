import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CommerceOrder } from "@/lib/commerce/orders/types";
import type {
  CommerceRepository,
  FulfillmentAttemptRecord,
  PersistWebhookEventInput,
  PersistWebhookEventResult,
  ProviderMappingBundle,
  ProviderOrderEventRecord,
  ProviderOrderRecord,
  ProviderProductMapping,
  ProviderVariantMapping,
  StoredWebhookEvent,
  StripeTransferRecord,
  WebhookProcessingStatus,
} from "@/lib/commerce/persistence/types";

interface CommerceFileState {
  orders: CommerceOrder[];
  webhookEvents: StoredWebhookEvent[];
  providerProductMappings: ProviderProductMapping[];
  providerVariantMappings: ProviderVariantMapping[];
  stripeTransfers: StripeTransferRecord[];
  providerOrders: ProviderOrderRecord[];
  providerOrderEvents: ProviderOrderEventRecord[];
  fulfillmentAttempts: FulfillmentAttemptRecord[];
}

const emptyState: CommerceFileState = {
  orders: [],
  webhookEvents: [],
  providerProductMappings: [],
  providerVariantMappings: [],
  stripeTransfers: [],
  providerOrders: [],
  providerOrderEvents: [],
  fulfillmentAttempts: [],
};

export class FileCommerceRepository implements CommerceRepository {
  private readonly filePath: string;

  constructor(filePath = process.env.COMMERCE_FILE_DB_PATH) {
    this.filePath =
      filePath || path.join(process.cwd(), ".data", "commerce-db.json");
  }

  private async readState(): Promise<CommerceFileState> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return { ...emptyState, ...(JSON.parse(raw) as Partial<CommerceFileState>) };
    } catch {
      return this.seedState();
    }
  }

  private async seedState(): Promise<CommerceFileState> {
    const state: CommerceFileState = { ...emptyState };

    try {
      const seedPath = path.join(
        process.cwd(),
        "db",
        "seeds",
        "wear-provider-mappings.json",
      );
      const raw = await readFile(seedPath, "utf8");
      const seeds = JSON.parse(raw) as Array<
        ProviderProductMapping & {
          internalProductId: string;
          variants?: Array<{
            internalVariantId: string;
            providerVariantId: string;
            sku?: string;
          }>;
        }
      >;

      state.providerProductMappings = seeds.map((seed) => ({
        id: seed.id,
        brand: seed.brand,
        internalProductId: seed.internalProductId,
        provider: seed.provider,
        providerProductId: seed.providerProductId,
        providerVariantId: seed.providerVariantId,
        providerShopId: seed.providerShopId,
        providerRegion: seed.providerRegion,
        currency: seed.currency,
        active: seed.active,
        metadata: seed.metadata,
      }));
      state.providerVariantMappings = seeds.flatMap((seed) =>
        (seed.variants || []).map((variant) => ({
          id: `${seed.id}:${variant.internalVariantId}`,
          productMappingId: seed.id,
          internalProductId: seed.internalProductId,
          internalVariantId: variant.internalVariantId,
          provider: seed.provider,
          providerProductId: seed.providerProductId,
          providerVariantId: variant.providerVariantId,
          sku: variant.sku || null,
          active: seed.active,
          metadata: seed.metadata,
        })),
      );
    } catch {
      return state;
    }

    return state;
  }

  private async writeState(state: CommerceFileState) {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(state, null, 2));
  }

  async saveOrder(order: CommerceOrder) {
    const state = await this.readState();
    state.orders = [
      ...state.orders.filter((entry) => entry.orderId !== order.orderId),
      order,
    ];
    await this.writeState(state);
    return order;
  }

  async getOrder(orderId: string) {
    const state = await this.readState();
    return state.orders.find((order) => order.orderId === orderId) || null;
  }

  async getOrderByCheckoutSessionId(checkoutSessionId: string) {
    const state = await this.readState();
    return (
      state.orders.find((order) => order.checkoutSessionId === checkoutSessionId) ||
      null
    );
  }

  async markOrderPaid({
    orderId,
    paymentIntentId,
    checkoutSessionId,
  }: {
    orderId: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
  }) {
    const state = await this.readState();
    const order = state.orders.find((entry) => entry.orderId === orderId);

    if (!order) {
      return null;
    }

    const updatedOrder: CommerceOrder = {
      ...order,
      paymentIntentId: paymentIntentId || order.paymentIntentId,
      checkoutSessionId: checkoutSessionId || order.checkoutSessionId,
      statuses: { ...order.statuses, payment: "paid" },
      timestamps: { ...order.timestamps, updatedAt: new Date().toISOString() },
    };
    state.orders = state.orders.map((entry) =>
      entry.orderId === orderId ? updatedOrder : entry,
    );
    await this.writeState(state);
    return updatedOrder;
  }

  async persistWebhookEvent(
    input: PersistWebhookEventInput,
  ): Promise<PersistWebhookEventResult> {
    const state = await this.readState();
    const existing = state.webhookEvents.find(
      (event) =>
        event.provider === input.provider && event.eventId === input.eventId,
    );

    if (existing) {
      return { event: existing, duplicate: true };
    }

    const event: StoredWebhookEvent = {
      id: `${input.provider}:${input.eventId}`,
      provider: input.provider,
      eventId: input.eventId,
      eventType: input.eventType,
      payloadHash: input.payloadHash,
      payloadJson: input.payloadJson,
      receivedAt: new Date().toISOString(),
      processedAt: null,
      processingStatus: "pending",
      errorMessage: null,
      idempotencyKey: input.idempotencyKey,
    };
    state.webhookEvents.push(event);
    await this.writeState(state);
    return { event, duplicate: false };
  }

  async listWebhookEvents({
    provider,
    status,
    limit = 50,
  }: {
    provider?: StoredWebhookEvent["provider"];
    status?: WebhookProcessingStatus;
    limit?: number;
  } = {}) {
    const state = await this.readState();
    return state.webhookEvents
      .filter((event) => !provider || event.provider === provider)
      .filter((event) => !status || event.processingStatus === status)
      .slice(-limit)
      .reverse();
  }

  async getWebhookEvent({
    provider,
    eventId,
  }: {
    provider: StoredWebhookEvent["provider"];
    eventId: string;
  }) {
    const state = await this.readState();
    return (
      state.webhookEvents.find(
        (event) => event.provider === provider && event.eventId === eventId,
      ) || null
    );
  }

  async markWebhookEventStatus({
    eventId,
    provider,
    status,
    errorMessage = null,
  }: {
    eventId: string;
    provider: StoredWebhookEvent["provider"];
    status: WebhookProcessingStatus;
    errorMessage?: string | null;
  }) {
    const state = await this.readState();
    state.webhookEvents = state.webhookEvents.map((event) =>
      event.provider === provider && event.eventId === eventId
        ? {
            ...event,
            processingStatus: status,
            errorMessage,
            processedAt:
              status === "processed" || status === "failed" || status === "ignored"
                ? new Date().toISOString()
                : event.processedAt,
          }
        : event,
    );
    await this.writeState(state);
  }

  async getProviderMapping({
    productId,
    variantId,
    provider,
    region,
  }: {
    productId: string;
    variantId: string;
    provider: ProviderMappingBundle["productMapping"]["provider"];
    region?: string;
  }) {
    const state = await this.readState();
    const productMapping = state.providerProductMappings.find(
      (mapping) =>
        mapping.internalProductId === productId &&
        mapping.provider === provider &&
        mapping.active &&
        (!region || mapping.providerRegion === region),
    );

    if (!productMapping) {
      return null;
    }

    const variantMapping = state.providerVariantMappings.find(
      (mapping) =>
        mapping.productMappingId === productMapping.id &&
        mapping.internalVariantId === variantId &&
        mapping.active,
    );

    return variantMapping ? { productMapping, variantMapping } : null;
  }

  async recordStripeTransfer(record: StripeTransferRecord) {
    const state = await this.readState();
    const existing = state.stripeTransfers.find(
      (entry) => entry.idempotencyKey === record.idempotencyKey,
    );
    const nextRecord = existing
      ? { ...record, attemptCount: existing.attemptCount + 1 }
      : record;
    state.stripeTransfers = [
      ...state.stripeTransfers.filter(
        (entry) => entry.idempotencyKey !== record.idempotencyKey,
      ),
      nextRecord,
    ];
    await this.writeState(state);
    return nextRecord;
  }

  async getStripeTransferByIdempotencyKey(idempotencyKey: string) {
    const state = await this.readState();
    return (
      state.stripeTransfers.find(
        (entry) => entry.idempotencyKey === idempotencyKey,
      ) || null
    );
  }

  async recordProviderOrder(record: ProviderOrderRecord) {
    const state = await this.readState();
    state.providerOrders = [
      ...state.providerOrders.filter(
        (entry) => entry.idempotencyKey !== record.idempotencyKey,
      ),
      record,
    ];
    await this.writeState(state);
    return record;
  }

  async getProviderOrderByIdempotencyKey(idempotencyKey: string) {
    const state = await this.readState();
    return (
      state.providerOrders.find(
        (entry) => entry.idempotencyKey === idempotencyKey,
      ) || null
    );
  }

  async listProviderOrders({
    provider,
    status,
    limit = 50,
  }: {
    provider?: ProviderOrderRecord["provider"];
    status?: ProviderOrderRecord["status"];
    limit?: number;
  } = {}) {
    const state = await this.readState();
    return state.providerOrders
      .filter((order) => !provider || order.provider === provider)
      .filter((order) => !status || order.status === status)
      .slice(-limit)
      .reverse();
  }

  async recordProviderOrderEvent(record: ProviderOrderEventRecord) {
    const state = await this.readState();
    state.providerOrderEvents = [
      ...state.providerOrderEvents.filter((event) => event.id !== record.id),
      record,
    ];
    await this.writeState(state);
    return record;
  }

  async recordFulfillmentAttempt(record: FulfillmentAttemptRecord) {
    const state = await this.readState();
    const existing = state.fulfillmentAttempts.find(
      (entry) => entry.idempotencyKey === record.idempotencyKey,
    );
    const nextRecord = existing
      ? { ...record, attemptCount: existing.attemptCount + 1 }
      : record;
    state.fulfillmentAttempts = [
      ...state.fulfillmentAttempts.filter(
        (entry) => entry.idempotencyKey !== record.idempotencyKey,
      ),
      nextRecord,
    ];
    await this.writeState(state);
    return nextRecord;
  }
}
