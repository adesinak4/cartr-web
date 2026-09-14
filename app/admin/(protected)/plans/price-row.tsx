"use client";

import { useState, useTransition } from "react";
import { updatePlanPrice } from "./actions";
import { Toast } from "@/components/toast";
import { PlanPrice } from "@/lib/types";

export function PriceRow({ planId, price }: { planId: string; price: PlanPrice }) {
  const [value, setValue] = useState(price.totalPrice);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = value !== price.totalPrice;

  function onSave() {
    startTransition(async () => {
      const result = await updatePlanPrice(planId, price.periodMonths, value);
      if (result.error) {
        setError(result.error);
      } else {
        setToast(`${price.periodMonths}-month price updated.`);
      }
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-grey-200 py-3 last:border-0">
      <span className="text-sm text-grey-500">{price.periodMonths} months</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-grey-400">₦</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          className="w-28 rounded-md border border-grey-200 px-2 py-1.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || pending}
          className="rounded-md bg-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      <Toast
        message={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
