"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { IconPlus } from "@/components/icons";

interface AddToCartButtonProps {
  slug: string;
  product: { id: string; name: string; price: string };
  qty?: number;
  compact?: boolean;
}

export function AddToCartButton({ slug, product, qty = 1, compact = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(slug, product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    // Notify same-tab listeners (cart-link's badge) — the native `storage`
    // event only fires on OTHER tabs/documents, not this one.
    window.dispatchEvent(new Event("cartr-cart-changed"));
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center justify-center gap-1 rounded-md bg-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        <IconPlus className="h-3.5 w-3.5" />
        {added ? "Added" : "Add"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
