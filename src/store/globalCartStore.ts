"use client";

import { create } from "zustand";

import type {
  CommerceBrandId,
  CommerceSource,
  CurrencyCode,
  FulfillmentProvider,
} from "@/lib/commerce/types";

export interface GlobalCartItem {
  lineId: string;
  productId: string;
  variantId: string;
  brand: CommerceBrandId;
  source: CommerceSource;
  quantity: number;
  displayPrice: number;
  checkoutPrice: number;
  currency: CurrencyCode;
  fulfillmentProvider: FulfillmentProvider;
  title: string;
  image?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

interface GlobalCartStore {
  items: GlobalCartItem[];
  isOpen: boolean;
  addItem: (item: Omit<GlobalCartItem, "lineId" | "quantity">) => void;
  removeItem: (lineId: string) => void;
  increaseItem: (lineId: string) => void;
  decreaseItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

function makeLineId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export const useGlobalCartStore = create<GlobalCartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const lineId = makeLineId(item.productId, item.variantId);
      const existingItem = state.items.find((entry) => entry.lineId === lineId);

      if (existingItem) {
        return {
          items: state.items.map((entry) =>
            entry.lineId === lineId
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          ),
          isOpen: true,
        };
      }

      return {
        items: [...state.items, { ...item, lineId, quantity: 1 }],
        isOpen: true,
      };
    }),

  removeItem: (lineId) =>
    set((state) => ({
      items: state.items.filter((item) => item.lineId !== lineId),
    })),

  increaseItem: (lineId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.lineId === lineId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  decreaseItem: (lineId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().items.reduce(
      (total, item) => total + item.checkoutPrice * item.quantity,
      0,
    ),
}));
