"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

// Order confirmation itself happens asynchronously via cartr-api's webhook,
// not here — this page is just where Flutterwave sends the customer back.
// Clearing the cart here (rather than at submit time) means an abandoned/
// failed payment doesn't silently lose the customer's cart.
export function ConfirmationClient({ slug }: { slug: string }) {
  useEffect(() => {
    clearCart(slug);
    window.dispatchEvent(new Event("cartr-cart-changed"));
  }, [slug]);

  return null;
}
