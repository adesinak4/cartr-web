"use client";

import { useState, useTransition } from "react";
import { refundOrder } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";

export function RefundButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onConfirm() {
    startTransition(async () => {
      const result = await refundOrder(orderId);
      setConfirming(false);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return <p className="text-sm text-success">Refund initiated.</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="rounded-md border border-error px-4 py-2 text-sm font-medium text-error transition hover:bg-error-light disabled:opacity-60"
      >
        {pending ? "Refunding…" : "Refund order"}
      </button>
      <ConfirmDialog
        open={confirming}
        title="Refund this order?"
        body="This issues a full refund through the payment provider and cannot be undone."
        confirmLabel="Refund"
        danger
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirming(false)}
      />
      <Toast message={error} variant="error" onDismiss={() => setError(null)} />
    </>
  );
}
