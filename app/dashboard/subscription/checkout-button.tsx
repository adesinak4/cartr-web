"use client";

import { useState, useTransition } from "react";
import { startCheckout } from "./actions";

export function CheckoutButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await startCheckout();
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={pending}
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        {pending ? "Starting checkout…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
