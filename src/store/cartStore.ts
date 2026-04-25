"use client";

import { create } from "zustand";

import type { Region } from "@/data/products.data";

interface ProductRegionInfo {
  price: number;
  currency: string;
}

interface CartProduct {
  id: string;
  collection: string;
  name: string;
  image: string;
  regions: Record<Region, ProductRegionInfo>;
}

interface CartItem {
  product: CartProduct;
  size: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  region: Region;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hydrateRegionFromCookie: () => void;
}

function getRegionPrice(item: CartItem, region: Region) {
  const regionalInfo = item.product.regions[region] ?? item.product.regions.EU;
  return regionalInfo.price * item.quantity;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  region: "EU",

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (entry) =>
          entry.product.id === item.product.id && entry.size === item.size,
      );

      if (existingItem) {
        return {
          items: state.items.map((entry) =>
            entry.product.id === item.product.id && entry.size === item.size
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }),

  removeItem: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (entry) => !(entry.product.id === productId && entry.size === size),
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce(
      (total, item) => total + getRegionPrice(item, get().region),
      0,
    ),

  hydrateRegionFromCookie: () => {
    if (typeof document === "undefined") {
      return;
    }

    const match = document.cookie.match(/(?:^|;\s*)z21_region=(EU|US)(?:;|$)/);

    if (match?.[1] === "EU" || match?.[1] === "US") {
      set({ region: match[1] });
    }
  },
}));
