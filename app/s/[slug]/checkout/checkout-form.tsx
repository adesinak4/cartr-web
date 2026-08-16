"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { getCart, cartTotal, CartItem } from "@/lib/cart";
import { submitCheckout, CheckoutState } from "./actions";
import { IconCheckCircle } from "@/components/icons";

const initialCheckoutState: CheckoutState = { error: null };

function Step({
  label,
  index,
  active,
  done,
}: {
  label: string;
  index: number;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
          done ? "bg-success text-white" : active ? "bg-blue text-white" : "bg-grey-200 text-grey-500"
        }`}
      >
        {done ? <IconCheckCircle className="h-4 w-4" /> : index}
      </div>
      <span className={`text-xs ${active ? "text-dark" : "text-grey-400"}`}>{label}</span>
    </div>
  );
}

export function CheckoutForm({ slug }: { slug: string }) {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const boundAction = submitCheckout.bind(null, slug, items ?? []);
  const [state, formAction, pending] = useActionState(boundAction, initialCheckoutState);

  useEffect(() => {
    // Deferred to an effect, not a lazy initializer — see cart-link.tsx for
    // why (avoids an SSR/client hydration mismatch on localStorage-derived state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCart(slug));
  }, [slug]);

  if (items === null) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-sm text-grey-500">Your cart is empty.</p>
        <Link href={`/s/${slug}`} className="text-sm text-blue hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mx-auto mb-8 flex max-w-md items-start">
        <Step label="Cart" index={1} active={false} done />
        <Step label="Checkout" index={2} active={!pending} done={false} />
        <Step label="Confirm" index={3} active={false} done={false} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <form action={formAction} className="flex flex-col gap-6">
          <div className="rounded-lg border border-grey-200 p-6">
            <h2 className="mb-4 text-sm font-medium text-dark">Delivery details</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm text-grey-500">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm text-grey-500">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm text-grey-500">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm text-grey-500">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="deliveryStreet" className="mb-1 block text-sm text-grey-500">
                  Street address
                </label>
                <input
                  id="deliveryStreet"
                  name="deliveryStreet"
                  required
                  className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deliveryCity" className="mb-1 block text-sm text-grey-500">
                    City
                  </label>
                  <input
                    id="deliveryCity"
                    name="deliveryCity"
                    required
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryState" className="mb-1 block text-sm text-grey-500">
                    State
                  </label>
                  <input
                    id="deliveryState"
                    name="deliveryState"
                    required
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="note" className="mb-1 block text-sm text-grey-500">
                  Order note (optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-grey-200 p-6">
            <h2 className="mb-4 text-sm font-medium text-dark">Payment</h2>
            <div className="mb-4 rounded-md bg-blue-light p-3 text-xs text-blue">
              You&apos;ll be redirected to our payment provider to complete your payment
              securely.
            </div>
            <p className="mb-4 text-xs text-grey-400">
              Accepts cards, bank transfer, USSD & more.
            </p>

            {state.error && <p className="mb-3 text-sm text-error">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
            >
              {pending ? "Processing…" : "Pay now"}
            </button>
          </div>
        </form>

        <div className="h-fit rounded-lg border border-grey-200 p-5">
          <h2 className="mb-3 text-sm font-medium text-grey-500">Order summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-grey-500">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>{(Number(item.price) * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-grey-200 pt-3 text-sm font-medium text-dark">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
