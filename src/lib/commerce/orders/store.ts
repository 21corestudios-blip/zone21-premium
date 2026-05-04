import type { CommerceOrder } from "@/lib/commerce/orders/types";
import { getCommerceRepository } from "@/lib/commerce/persistence/repository";

export async function saveOrder(order: CommerceOrder) {
  return getCommerceRepository().saveOrder(order);
}

export async function getOrder(orderId: string) {
  return getCommerceRepository().getOrder(orderId);
}

export async function getOrderByCheckoutSessionId(checkoutSessionId: string) {
  return getCommerceRepository().getOrderByCheckoutSessionId(checkoutSessionId);
}

export async function markOrderPaid(input: {
  orderId: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
}) {
  return getCommerceRepository().markOrderPaid(input);
}
