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
  formatTalentsPrice,
  getTalentsProductById,
  type TalentsProduct,
} from "@/data/talents.products";

const STORAGE_KEY = "zone21-talents-cart";
const MAX_ITEM_QUANTITY = 10;

interface TalentsCartStoredItem {
  productId: string;
  quantity: number;
}

export interface TalentsCartItem extends TalentsCartStoredItem {
  product: TalentsProduct;
  lineTotalCents: number;
  lineTotalFormatted: string;
}

interface TalentsCartContextValue {
  items: TalentsCartItem[];
  itemCount: number;
  subtotalCents: number;
  subtotalFormatted: string;
  isHydrated: boolean;
  addItem: (product: TalentsProduct) => void;
  decrementItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const TalentsCartContext = createContext<TalentsCartContextValue | null>(null);

function sanitizeStoredItems(value: unknown): TalentsCartStoredItem[] {
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

    if (!getTalentsProductById(entry.productId)) {
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

export default function TalentsCartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [storedItems, setStoredItems] = useState<TalentsCartStoredItem[]>([]);
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

  const items = useMemo<TalentsCartItem[]>(() => {
    return storedItems.flatMap((item) => {
      const product = getTalentsProductById(item.productId);

      if (!product) {
        return [];
      }

      const lineTotalCents = product.priceCents * item.quantity;

      return [
        {
          ...item,
          product,
          lineTotalCents,
          lineTotalFormatted: formatTalentsPrice(
            lineTotalCents,
            product.currency,
          ),
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

  const addItem = (product: TalentsProduct) => {
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

  const value = useMemo<TalentsCartContextValue>(
    () => ({
      items,
      itemCount,
      subtotalCents,
      subtotalFormatted: formatTalentsPrice(subtotalCents),
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
    <TalentsCartContext.Provider value={value}>
      {children}
    </TalentsCartContext.Provider>
  );
}

export function useTalentsCart() {
  const context = useContext(TalentsCartContext);

  if (!context) {
    throw new Error("useTalentsCart must be used within TalentsCartProvider");
  }

  return context;
}
