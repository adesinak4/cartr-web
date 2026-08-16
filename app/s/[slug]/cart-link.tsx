"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCart, cartCount } from "@/lib/cart";
import { IconBox } from "@/components/icons";

export function CartLink({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Deliberately deferred to an effect, not a lazy useState initializer —
    // this reads localStorage, a browser-only API. Computing it during the
    // first render would mismatch the server-rendered HTML (which always
    // has no cart data) and trigger a hydration error.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(cartCount(getCart(slug)));

    function refresh() {
      setCount(cartCount(getCart(slug)));
    }
    // "storage" covers other tabs; "cartr-cart-changed" (dispatched by
    // AddToCartButton) covers same-tab updates without a full navigation.
    window.addEventListener("storage", refresh);
    window.addEventListener("cartr-cart-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cartr-cart-changed", refresh);
    };
  }, [slug]);

  // The order-confirmation page hides the cart icon — matching the real
  // prototype, and sensible since the cart is already cleared by then.
  if (pathname?.endsWith("/checkout/confirmation")) return null;

  return (
    <Link
      href={`/s/${slug}/cart`}
      className="relative flex items-center gap-2 text-sm text-dark hover:text-blue"
    >
      <IconBox className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
