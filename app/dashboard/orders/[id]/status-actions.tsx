"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "../actions";
import { OrderStatus } from "@/lib/types";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Confirm order",
  confirmed: "Mark as shipped",
  shipped: "Mark as delivered",
};

export function StatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function apply(next: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (result.error) setError(result.error);
    });
  }

  const nextStatus = NEXT_STATUS[status];
  const canCancel = status === "pending" || status === "confirmed";

  if (!nextStatus && !canCancel) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        {nextStatus && (
          <button
            onClick={() => apply(nextStatus)}
            disabled={pending}
            className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
          >
            {pending ? "Updating…" : NEXT_LABEL[status]}
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => apply("cancelled")}
            disabled={pending}
            className="rounded-md border border-grey-200 px-4 py-2 text-sm font-medium text-error transition hover:bg-error-light disabled:opacity-60"
          >
            Cancel order
          </button>
        )}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
