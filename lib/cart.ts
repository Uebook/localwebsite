'use client';

export interface CartItem {
       id: string;
       vendorId: string;
       vendorName: string;
       name: string;
       price: number;
       quantity: number;
       image?: string;
}

const STORAGE_KEY = 'localmarket_cart';

export const getCart = (): CartItem[] => {
       if (typeof window === 'undefined') return [];
       const saved = localStorage.getItem(STORAGE_KEY);
       if (!saved) return [];
       try {
              return JSON.parse(saved);
       } catch {
              return [];
       }
};

export const saveCart = (items: CartItem[]) => {
       if (typeof window === 'undefined') return;
       localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
       window.dispatchEvent(new Event('cartchange'));
};

export const addToCart = (item: CartItem) => {
       const items = getCart();
       const existing = items.find(i => i.id === item.id);
       if (existing) {
              existing.quantity += 1;
       } else {
              items.push({ ...item, quantity: 1 });
       }
       saveCart(items);
};

export const removeFromCart = (itemId: string) => {
       const items = getCart().filter(i => i.id !== itemId);
       saveCart(items);
};

export const updateQuantity = (itemId: string, quantity: number) => {
       const items = getCart();
       const item = items.find(i => i.id === itemId);
       if (item) {
              item.quantity = Math.max(0, quantity);
              if (item.quantity === 0) {
                     return removeFromCart(itemId);
              }
       }
       saveCart(items);
};

export const clearCart = () => {
       saveCart([]);
};
