"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { PublicProduct } from "@/lib/types";

export function ProductDetail({ slug, product }: { slug: string; product: PublicProduct }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function changeQty(delta: number) {
    setQty((prev) => Math.max(1, Math.min(product.stock || 1, prev + delta)));
  }

  function onAddToCart() {
    addToCart(
      slug,
      { id: product.id, name: product.name, price: product.price },
      qty,
    );
    setAdded(true);
    window.dispatchEvent(new Event("cartr-cart-changed"));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeQty(-1)}
            className="h-9 w-9 rounded-md border border-grey-200 text-dark"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            onClick={() => changeQty(1)}
            className="h-9 w-9 rounded-md border border-grey-200 text-dark"
          >
            +
          </button>
        </div>
        <button
          onClick={onAddToCart}
          className="flex-1 rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>

      <Link
        href={`/s/${slug}/cart`}
        className="rounded-md border border-grey-200 px-4 py-2.5 text-center text-sm font-medium text-dark transition hover:bg-grey-100"
      >
        View cart
      </Link>
    </div>
  );
}
