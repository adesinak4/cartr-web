"use client";

import { useState } from "react";
import { Toast } from "@/components/toast";

export function BillingHistoryButton() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setToast("Billing history is coming soon.")}
        className="rounded-md border border-grey-200 px-3 py-1.5 text-sm text-dark transition hover:bg-grey-100"
      >
        Billing history
      </button>
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
