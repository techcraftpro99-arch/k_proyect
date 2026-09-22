"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartItem } from "@/types/product";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "digital-store-cart";
const EMPTY_CART: CartItem[] = [];

let cartItems: CartItem[] = EMPTY_CART;
let initialized = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function initCart() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    cartItems = stored ? (JSON.parse(stored) as CartItem[]) : EMPTY_CART;
  } catch {
    cartItems = EMPTY_CART;
  }
}

function writeCart(items: CartItem[]) {
  cartItems = items.length === 0 ? EMPTY_CART : items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

function subscribe(listener: () => void) {
  initCart();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  initCart();
  return cartItems;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    initCart();
    if (cartItems.some((i) => i.productId === item.productId)) return;
    writeCart([...cartItems, { ...item, quantity: 1 }]);
  }, []);

  const removeItem = useCallback((productId: string) => {
    initCart();
    writeCart(cartItems.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, total, count: items.length }),
    [items, addItem, removeItem, clearCart, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
