"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { getCart, updateCartQty, removeFromCart, cartTotal, CartItem } from "@/lib/cart";
import { EmptyState } from "@/components/empty-state";
import { IconArrowLeft, IconBox, IconShield, IconTrash } from "@/components/icons";

export default function CartPage(props: PageProps<"/s/[slug]/cart">) {
  const { slug } = use(props.params);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Deferred to an effect, not a lazy initializer — see cart-link.tsx for
    // why (avoids an SSR/client hydration mismatch on localStorage-derived state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCart(slug));
  }, [slug]);

  function changeQty(productId: string, qty: number) {
    const updated = updateCartQty(slug, productId, qty);
    setItems(updated);
    window.dispatchEvent(new Event("cartr-cart-changed"));
  }

  function remove(productId: string) {
    const updated = removeFromCart(slug, productId);
    setItems(updated);
    window.dispatchEvent(new Event("cartr-cart-changed"));
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <EmptyState
          icon={<IconBox className="h-6 w-6" />}
          title="Your cart is empty"
          body="Browse our collection and add something you love."
          action={
            <Link
              href={`/s/${slug}`}
              className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
            >
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-dark">Your cart</h1>
      <p className="mt-1 text-sm text-grey-500">Review your items before checkout.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-lg border border-grey-200 p-3"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-grey-100 text-grey-400">
                  <IconBox className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-dark">{item.name}</p>
                  <p className="text-xs text-grey-400">{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(item.productId, item.qty - 1)}
                    className="h-7 w-7 rounded-md border border-grey-200 text-sm text-dark"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.productId, item.qty + 1)}
                    className="h-7 w-7 rounded-md border border-grey-200 text-sm text-dark"
                  >
                    +
                  </button>
                </div>
                <p className="w-20 shrink-0 text-right text-sm font-medium text-dark">
                  {(Number(item.price) * item.qty).toFixed(2)}
                </p>
                <button
                  onClick={() => remove(item.productId)}
                  aria-label="Remove"
                  className="shrink-0 text-grey-400 transition hover:text-error"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Link
            href={`/s/${slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-dark hover:text-blue"
          >
            <IconArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        </div>

        <div className="h-fit rounded-lg border border-grey-200 p-5">
          <h2 className="mb-3 text-sm font-medium text-grey-500">Order summary</h2>
          <div className="flex justify-between text-sm text-grey-500">
            <span>Subtotal</span>
            <span>{total.toFixed(2)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-grey-200 pt-3 text-sm font-medium text-dark">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
          <Link
            href={`/s/${slug}/checkout`}
            className="mt-4 block w-full rounded-md bg-blue px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-dark"
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-grey-400">
            <IconShield className="h-3.5 w-3.5 text-success" /> Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
