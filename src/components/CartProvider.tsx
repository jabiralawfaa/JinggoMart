"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  sellerNama: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (product: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "jinggomart_cart";

interface RawCartItem {
  id: unknown;
  nama: unknown;
  harga: unknown;
  stok: unknown;
  kategori: unknown;
  sellerNama: unknown;
  qty: unknown;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x: RawCartItem) => ({
        id: String(x?.id ?? ""),
        nama: String(x?.nama ?? ""),
        harga: Number(x?.harga) || 0,
        stok: Number(x?.stok) || 0,
        kategori: String(x?.kategori ?? ""),
        sellerNama: String(x?.sellerNama ?? ""),
        qty: Math.max(1, Number(x?.qty) || 1),
      }))
      .filter((x: CartItem) => x.id);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Server dan render pertama hydration selalu kosong → muat cart di effect
  // agar tidak terjadi hydration mismatch saat isi localStorage tidak kosong.
  const [items, setItems] = useState<CartItem[]>([]);
  const firstPersist = useRef(true);

  useEffect(() => {
    // Muat data client-only sekali setelah hydration; aman karena server selalu render [].
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadCart());
  }, []);

  // Persist ke localStorage setelah load pertama (jangan menimpa sebelum terbaca).
  useEffect(() => {
    if (firstPersist) {
      firstPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* abaikan jika localStorage tidak tersedia */
    }
  }, [items]);

  const add = useCallback(
    (product: Omit<CartItem, "qty">, qty = 1) => {
      setItems((prev) => {
        const safeQty = Math.max(1, Math.min(qty, product.stok || 1));
        const existing = prev.find((x) => x.id === product.id);
        if (existing) {
          const nextQty = Math.min(
            existing.qty + safeQty,
            product.stok || existing.stok || 1
          );
          return prev.map((x) =>
            x.id === product.id ? { ...x, qty: Math.max(1, nextQty) } : x
          );
        }
        return [
          ...prev,
          {
            ...product,
            qty: safeQty,
            stok: product.stok || 0,
          },
        ];
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const max = x.stok || 1;
        const next = Math.max(1, Math.min(qty, max));
        return { ...x, qty: next };
      })
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const { count, total } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const it of items) {
      count += it.qty;
      total += it.harga * it.qty;
    }
    return { count, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, count, total }),
    [items, add, remove, setQty, clear, count, total]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}