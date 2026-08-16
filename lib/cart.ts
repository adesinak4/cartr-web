"use client";

// Client-only, localStorage-backed. Namespaced per merchant slug — the old
// static prototype used one global cart key, which would silently bleed
// items between different stores' carts. Not used server-side at all.

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  qty: number;
}

function storageKey(slug: string): string {
  return `cartr_cart_${slug}`;
}

export function getCart(slug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(slug: string, items: CartItem[]): void {
  window.localStorage.setItem(storageKey(slug), JSON.stringify(items));
}

export function addToCart(
  slug: string,
  product: { id: string; name: string; price: string },
  qty: number = 1,
): CartItem[] {
  const items = getCart(slug);
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ productId: product.id, name: product.name, price: product.price, qty });
  }

  saveCart(slug, items);
  return items;
}

export function updateCartQty(slug: string, productId: string, qty: number): CartItem[] {
  let items = getCart(slug);
  if (qty <= 0) {
    items = items.filter((item) => item.productId !== productId);
  } else {
    const existing = items.find((item) => item.productId === productId);
    if (existing) existing.qty = qty;
  }
  saveCart(slug, items);
  return items;
}

export function removeFromCart(slug: string, productId: string): CartItem[] {
  const items = getCart(slug).filter((item) => item.productId !== productId);
  saveCart(slug, items);
  return items;
}

export function clearCart(slug: string): void {
  saveCart(slug, []);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
