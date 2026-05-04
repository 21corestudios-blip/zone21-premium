import { createHash } from "node:crypto";

import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import type { ProviderOrderRecord } from "@/lib/commerce/persistence/types";
import { createGelatoClient } from "@/lib/commerce/providers/gelato/client";
import { createPrintifyClient } from "@/lib/commerce/providers/printify/client";

type ProviderOrderStatus = ProviderOrderRecord["status"];

export async function refreshProviderOrderStatuses({
  provider,
  status,
  limit = 20,
}: {
  provider?: ProviderOrderRecord["provider"];
  status?: ProviderOrderRecord["status"];
  limit?: number;
} = {}) {
  const repository = getCommerceRepository();
  const orders = await repository.listProviderOrders({ provider, status, limit });
  const results = [];

  for (const order of orders) {
    results.push(await refreshProviderOrderStatus(order));
  }

  return results;
}

export async function refreshProviderOrderStatus(order: ProviderOrderRecord) {
  const repository = getCommerceRepository();

  if (!order.providerOrderId) {
    await repository.recordFulfillmentAttempt({
      id: `${order.id}:refresh:no-provider-order`,
      orderId: order.orderId,
      provider: order.provider,
      status: "failed",
      attemptCount: 1,
      idempotencyKey: `${order.id}:refresh:no-provider-order`,
      errorMessage: "provider order id missing",
    });

    return {
      id: order.id,
      provider: order.provider,
      refreshed: false,
      status: order.status,
      error: "provider order id missing",
    };
  }

  try {
    const rawStatus =
      order.provider === "gelato"
        ? await createGelatoClient().getOrder(order.providerOrderId)
        : await createPrintifyClient().getOrder(order.providerOrderId);
    const status = normalizeProviderStatus(order.provider, rawStatus);
    const tracking = extractTracking(rawStatus);
    const nextOrder: ProviderOrderRecord = {
      ...order,
      status,
      trackingJson: tracking,
      rawResponseJson: rawStatus,
    };

    await repository.recordProviderOrder(nextOrder);
    await repository.recordProviderOrderEvent({
      id: eventIdFor(order, rawStatus),
      providerOrderRecordId: order.id,
      provider: order.provider,
      eventType: `provider_status.${status}`,
      payloadJson: rawStatus,
    });
    await repository.recordFulfillmentAttempt({
      id: `${order.id}:refresh`,
      orderId: order.orderId,
      provider: order.provider,
      status: status === "failed" ? "failed" : "submitted",
      attemptCount: 1,
      idempotencyKey: `${order.id}:refresh`,
      rawResponseJson: rawStatus,
    });

    return {
      id: order.id,
      provider: order.provider,
      providerOrderId: order.providerOrderId,
      refreshed: true,
      status,
      tracking,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "provider status refresh failed";
    await repository.recordFulfillmentAttempt({
      id: `${order.id}:refresh`,
      orderId: order.orderId,
      provider: order.provider,
      status: "failed",
      attemptCount: 1,
      idempotencyKey: `${order.id}:refresh`,
      errorMessage: message,
    });

    return {
      id: order.id,
      provider: order.provider,
      providerOrderId: order.providerOrderId,
      refreshed: false,
      status: order.status,
      error: message,
    };
  }
}

function normalizeProviderStatus(
  provider: ProviderOrderRecord["provider"],
  rawStatus: unknown,
): ProviderOrderStatus {
  const status =
    typeof rawStatus === "object" && rawStatus && "status" in rawStatus
      ? String(rawStatus.status).toLowerCase()
      : "";

  if (["shipped", "fulfilled", "delivered"].includes(status)) {
    return "shipped";
  }

  if (
    ["in_production", "in production", "production", "printed"].includes(status)
  ) {
    return "in_production";
  }

  if (["accepted", "approved", "pending"].includes(status)) {
    return "accepted";
  }

  if (["canceled", "cancelled", "failed", "error", "rejected"].includes(status)) {
    return "failed";
  }

  return provider === "printify" ? "submitted" : "accepted";
}

function extractTracking(rawStatus: unknown) {
  if (!rawStatus || typeof rawStatus !== "object") {
    return null;
  }

  if ("trackingInfo" in rawStatus) {
    return rawStatus.trackingInfo;
  }

  if ("shipments" in rawStatus) {
    return rawStatus.shipments;
  }

  return null;
}

function eventIdFor(order: ProviderOrderRecord, payload: unknown) {
  const hash = createHash("sha256")
    .update(JSON.stringify(payload ?? null))
    .digest("hex")
    .slice(0, 16);

  return `${order.id}:status:${hash}`;
}
