"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  formatWearPrice,
  getWearProductById,
  isWearProductColor,
  isWearProductSize,
  wearLaunchColors,
  type WearProduct,
  type WearProductColor,
  type WearProductSize,
} from "@/data/wear.products";

const STORAGE_KEY = "zone21-wear-cart";
const MAX_ITEM_QUANTITY = 10;

interface WearCartStoredItem {
  productId: string;
  size: WearProductSize;
  color: WearProductColor;
  quantity: number;
}

export interface WearCartItem extends WearCartStoredItem {
  product: WearProduct;
  lineTotalCents: number;
  lineTotalFormatted: string;
}

interface WearCartContextValue {
  items: WearCartItem[];
  itemCount: number;
  subtotalCents: number;
  subtotalFormatted: string;
  isHydrated: boolean;
  addItem: (
    product: WearProduct,
    size: WearProductSize,
    color: WearProductColor,
  ) => void;
  decrementItem: (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => void;
  incrementItem: (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => void;
  removeItem: (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => void;
  clearCart: () => void;
}

const WearCartContext = createContext<WearCartContextValue | null>(null);

function sanitizeStoredItems(value: unknown): WearCartStoredItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.productId !== "string" ||
      typeof entry.size !== "string" ||
      typeof entry.quantity !== "number"
    ) {
      return [];
    }

    const product = getWearProductById(entry.productId);
    const color =
      "color" in entry &&
      typeof entry.color === "string" &&
      isWearProductColor(entry.color)
        ? entry.color
        : wearLaunchColors[0];

    if (
      !isWearProductSize(entry.size) ||
      !product ||
      !(product.availableColors || [wearLaunchColors[0]]).includes(color)
    ) {
      return [];
    }

    const quantity = Math.min(Math.max(Math.floor(entry.quantity), 1), MAX_ITEM_QUANTITY);

    return [
      {
        productId: entry.productId,
        size: entry.size,
        color,
        quantity,
      },
    ];
  });
}

export default function WearCartProvider({ children }: { children: ReactNode }) {
  const [storedItems, setStoredItems] = useState<WearCartStoredItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(STORAGE_KEY);

      if (!rawCart) {
        setIsHydrated(true);
        return;
      }

      const parsedCart = JSON.parse(rawCart) as unknown;
      setStoredItems(sanitizeStoredItems(parsedCart));
    } catch {
      setStoredItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
  }, [isHydrated, storedItems]);

  const items = useMemo<WearCartItem[]>(() => {
    return storedItems.flatMap((item) => {
      const product = getWearProductById(item.productId);

      if (!product) {
        return [];
      }

      const lineTotalCents = product.priceCents * item.quantity;

      return [
        {
          ...item,
          product,
          lineTotalCents,
          lineTotalFormatted: formatWearPrice(lineTotalCents, product.currency),
        },
      ];
    });
  }, [storedItems]);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotalCents = useMemo(() => {
    return items.reduce((total, item) => total + item.lineTotalCents, 0);
  }, [items]);

  const addItem = (
    product: WearProduct,
    size: WearProductSize,
    color: WearProductColor,
  ) => {
    setStoredItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.color === color,
      );

      if (existingItemIndex === -1) {
        return [
          ...currentItems,
          { productId: product.id, size, color, quantity: 1 },
        ];
      }

      return currentItems.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY),
            }
          : item,
      );
    });
  };

  const incrementItem = (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => {
    setStoredItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY),
            }
          : item,
      ),
    );
  };

  const decrementItem = (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => {
    setStoredItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (
          item.productId !== productId ||
          item.size !== size ||
          item.color !== color
        ) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const removeItem = (
    productId: string,
    size: WearProductSize,
    color: WearProductColor,
  ) => {
    setStoredItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          ),
      ),
    );
  };

  const clearCart = () => {
    setStoredItems([]);
  };

  const value = useMemo<WearCartContextValue>(
    () => ({
      items,
      itemCount,
      subtotalCents,
      subtotalFormatted: formatWearPrice(subtotalCents),
      isHydrated,
      addItem,
      decrementItem,
      incrementItem,
      removeItem,
      clearCart,
    }),
    [isHydrated, itemCount, items, subtotalCents],
  );

  return (
    <WearCartContext.Provider value={value}>
      {children}
    </WearCartContext.Provider>
  );
}

export function useWearCart() {
  const context = useContext(WearCartContext);

  if (!context) {
    throw new Error("useWearCart must be used within WearCartProvider");
  }

  return context;
}
