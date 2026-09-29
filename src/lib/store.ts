import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (item: CartItem, quantity: number) => void;
  remove: (item: CartItem) => void;
  clear: () => void;
};

function sameLine(a: CartItem, b: CartItem) {
  return a.productId === b.productId && a.color === b.color && a.size === b.size;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => sameLine(i, item));
        if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
        else items.push(item);
        set({ items });
      },
      setQty: (item, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => !sameLine(i, item)) });
          return;
        }
        set({
          items: get().items.map((i) => (sameLine(i, item) ? { ...i, quantity } : i)),
        });
      },
      remove: (item) => set({ items: get().items.filter((i) => !sameLine(i, item)) }),
      clear: () => set({ items: [] }),
    }),
    { name: "fc-cart" },
  ),
);

type WishState = {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  setAll: (ids: string[]) => void;
};

export const useWishlistLocal = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
      has: (id) => get().ids.includes(id),
      setAll: (ids) => set({ ids }),
    }),
    { name: "fc-wishlist" },
  ),
);

type RecentState = {
  ids: string[];
  push: (id: string) => void;
};

export const useRecent = create<RecentState>()(
  persist(
    (set, get) => ({
      ids: [],
      push: (id) => {
        const next = [id, ...get().ids.filter((x) => x !== id)].slice(0, 8);
        set({ ids: next });
      },
    }),
    { name: "fc-recent" },
  ),
);
