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
  formatCorePrice,
  getCoreProductById,
  type CoreProduct,
} from "@/data/core.products";

const STORAGE_KEY = "zone21-core-cart";
const MAX_ITEM_QUANTITY = 10;

interface CoreCartStoredItem {
  productId: string;
  quantity: number;
}

export interface CoreCartItem extends CoreCartStoredItem {
  product: CoreProduct;
  lineTotalCents: number;
  lineTotalFormatted: string;
}

interface CoreCartContextValue {
  items: CoreCartItem[];
  itemCount: number;
  subtotalCents: number;
  subtotalFormatted: string;
  isHydrated: boolean;
  addItem: (product: CoreProduct) => void;
  decrementItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CoreCartContext = createContext<CoreCartContextValue | null>(null);

function sanitizeStoredItems(value: unknown): CoreCartStoredItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.productId !== "string" ||
      typeof entry.quantity !== "number"
    ) {
      return [];
    }

    if (!getCoreProductById(entry.productId)) {
      return [];
    }

    const quantity = Math.min(
      Math.max(Math.floor(entry.quantity), 1),
      MAX_ITEM_QUANTITY,
    );

    return [
      {
        productId: entry.productId,
        quantity,
      },
    ];
  });
}

export default function CoreCartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [storedItems, setStoredItems] = useState<CoreCartStoredItem[]>([]);
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

  const items = useMemo<CoreCartItem[]>(() => {
    return storedItems.flatMap((item) => {
      const product = getCoreProductById(item.productId);

      if (!product) {
        return [];
      }

      const lineTotalCents = product.priceCents * item.quantity;

      return [
        {
          ...item,
          product,
          lineTotalCents,
          lineTotalFormatted: formatCorePrice(lineTotalCents, product.currency),
        },
      ];
    });
  }, [storedItems]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(
    () => items.reduce((total, item) => total + item.lineTotalCents, 0),
    [items],
  );

  const addItem = (product: CoreProduct) => {
    setStoredItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === product.id,
      );

      if (existingItemIndex === -1) {
        return [...currentItems, { productId: product.id, quantity: 1 }];
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

  const incrementItem = (productId: string) => {
    setStoredItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY),
            }
          : item,
      ),
    );
  };

  const decrementItem = (productId: string) => {
    setStoredItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.productId !== productId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const removeItem = (productId: string) => {
    setStoredItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const clearCart = () => {
    setStoredItems([]);
  };

  const value = useMemo<CoreCartContextValue>(
    () => ({
      items,
      itemCount,
      subtotalCents,
      subtotalFormatted: formatCorePrice(subtotalCents),
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
    <CoreCartContext.Provider value={value}>{children}</CoreCartContext.Provider>
  );
}

export function useCoreCart() {
  const context = useContext(CoreCartContext);

  if (!context) {
    throw new Error("useCoreCart must be used within CoreCartProvider");
  }

  return context;
}
