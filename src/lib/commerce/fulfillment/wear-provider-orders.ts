import type { CommerceOrder, CommerceOrderLine } from "@/lib/commerce/orders/types";
import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import { createGelatoClient } from "@/lib/commerce/providers/gelato/client";
import { resolveGelatoPrintFiles } from "@/lib/commerce/providers/gelato/print-files";
import { createPrintifyClient } from "@/lib/commerce/providers/printify/client";
import { buildStripeIdempotencyKey } from "@/lib/commerce/payments/stripe-connect";
import { getWearProviderRegion } from "@/lib/commerce/wear/routing";

export async function createWearProviderOrders(order: CommerceOrder) {
  const wearItems = order.items.filter(
    (item) =>
      item.brand === "wear" &&
      (item.fulfillmentProvider === "printify" ||
        item.fulfillmentProvider === "gelato"),
  );

  for (const item of wearItems) {
    await createWearProviderOrderForLine(order, item);
  }
}

async function createWearProviderOrderForLine(
  order: CommerceOrder,
  item: CommerceOrderLine,
) {
  if (
    item.fulfillmentProvider !== "printify" &&
    item.fulfillmentProvider !== "gelato"
  ) {
    return;
  }

  const repository = getCommerceRepository();
  const idempotencyKey = buildStripeIdempotencyKey([
    "provider-order",
    order.orderId,
    item.productId,
    item.variantId,
    item.fulfillmentProvider,
  ]);
  const existing = await repository.getProviderOrderByIdempotencyKey(
    idempotencyKey,
  );

  if (
    existing &&
    ["submitted", "accepted", "in_production", "shipped"].includes(
      existing.status,
    )
  ) {
    return;
  }

  const mapping = await repository.getProviderMapping({
    productId: item.productId,
    variantId: item.variantId,
    provider: item.fulfillmentProvider,
    region: order.customer?.shippingAddress?.country
      ? getWearProviderRegion(order.customer.shippingAddress.country)
      : undefined,
  });

  if (!mapping) {
    await repository.recordFulfillmentAttempt({
      id: idempotencyKey,
      orderId: order.orderId,
      orderItemId: `${order.orderId}:${item.productId}:${item.variantId}`,
      provider: item.fulfillmentProvider,
      status: "failed",
      attemptCount: 1,
      idempotencyKey,
      errorMessage: "provider mapping missing",
    });
    return;
  }

  try {
    const response =
      item.fulfillmentProvider === "gelato"
        ? await createGelatoOrder(order, item, mapping)
        : await createPrintifyOrder(order, item, mapping);
    const providerOrderId =
      typeof response === "object" && response
        ? "id" in response && typeof response.id === "string"
          ? response.id
          : "orderId" in response && typeof response.orderId === "string"
            ? response.orderId
            : null
        : null;

    await repository.recordProviderOrder({
      id: idempotencyKey,
      orderId: order.orderId,
      provider: item.fulfillmentProvider,
      providerOrderId,
      status: "submitted",
      rawResponseJson: response,
      idempotencyKey,
    });
    await repository.recordFulfillmentAttempt({
      id: idempotencyKey,
      orderId: order.orderId,
      orderItemId: `${order.orderId}:${item.productId}:${item.variantId}`,
      provider: item.fulfillmentProvider,
      status: "submitted",
      attemptCount: 1,
      idempotencyKey,
      rawResponseJson: response,
    });
  } catch (error) {
    await repository.recordProviderOrder({
      id: idempotencyKey,
      orderId: order.orderId,
      provider: item.fulfillmentProvider,
      providerOrderId: null,
      status: "failed",
      rawResponseJson: {
        error: error instanceof Error ? error.message : "provider order failed",
      },
      idempotencyKey,
    });
    await repository.recordFulfillmentAttempt({
      id: idempotencyKey,
      orderId: order.orderId,
      orderItemId: `${order.orderId}:${item.productId}:${item.variantId}`,
      provider: item.fulfillmentProvider,
      status: "failed",
      attemptCount: 1,
      idempotencyKey,
      errorMessage:
        error instanceof Error ? error.message : "provider order failed",
    });
  }
}

async function createGelatoOrder(
  order: CommerceOrder,
  item: CommerceOrderLine,
  mapping: NonNullable<
    Awaited<ReturnType<ReturnType<typeof getCommerceRepository>["getProviderMapping"]>>
  >,
) {
  const files = resolveGelatoPrintFiles(mapping.productMapping.metadata);

  if (!files.length) {
    throw new Error("Gelato print files are required for Gelato orders.");
  }

  const address = order.customer?.shippingAddress;

  if (!address?.country) {
    throw new Error("Shipping address is required for Gelato order.");
  }

  return createGelatoClient().createOrder({
    orderReferenceId: order.orderId,
    customerReferenceId: order.customer?.email || order.orderId,
    productUid: mapping.productMapping.providerProductId,
    itemReferenceId: `${item.productId}:${item.variantId}`,
    files,
    quantity: item.quantity,
    currency: item.unitAmount.currency,
    country: address.country,
    postalCode: address.postalCode,
    city: address.city,
    addressLine1: address.line1,
    email: order.customer?.email,
    phone: order.customer?.phone,
    firstName: order.customer?.fullName?.split(" ")[0],
    lastName: order.customer?.fullName?.split(" ").slice(1).join(" ") || "ARCANE",
  });
}

async function createPrintifyOrder(
  order: CommerceOrder,
  item: CommerceOrderLine,
  mapping: NonNullable<
    Awaited<ReturnType<ReturnType<typeof getCommerceRepository>["getProviderMapping"]>>
  >,
) {
  const address = order.customer?.shippingAddress;

  if (!address?.country || !address.line1 || !address.city) {
    throw new Error("Shipping address is required for Printify order.");
  }

  return createPrintifyClient().createOrder({
    external_id: order.orderId,
    line_items: [
      {
        product_id: mapping.productMapping.providerProductId,
        variant_id: Number(mapping.variantMapping.providerVariantId),
        quantity: item.quantity,
      },
    ],
    send_shipping_notification: true,
    address_to: {
      first_name: order.customer?.fullName?.split(" ")[0] || "ZONE",
      last_name:
        order.customer?.fullName?.split(" ").slice(1).join(" ") || "21",
      email: order.customer?.email,
      phone: order.customer?.phone,
      country: address.country,
      region: undefined,
      address1: address.line1,
      address2: address.line2,
      city: address.city,
      zip: address.postalCode,
    },
  });
}
