import type { CommerceOrder } from "@/lib/commerce/orders/types";

const memoryOrders = new Map<string, CommerceOrder>();

export async function saveOrder(order: CommerceOrder) {
  memoryOrders.set(order.orderId, order);
  return order;
}

export async function getOrder(orderId: string) {
  return memoryOrders.get(orderId) || null;
}

export async function markOrderPaid({
  orderId,
  paymentIntentId,
  checkoutSessionId,
}: {
  orderId: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
}) {
  const order = memoryOrders.get(orderId);

  if (!order) {
    return null;
  }

  const updatedOrder: CommerceOrder = {
    ...order,
    paymentIntentId,
    checkoutSessionId,
    statuses: {
      ...order.statuses,
      payment: "paid",
    },
    timestamps: {
      ...order.timestamps,
      updatedAt: new Date().toISOString(),
    },
  };

  memoryOrders.set(orderId, updatedOrder);
  return updatedOrder;
}
