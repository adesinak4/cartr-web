"use client";

import { FormEvent, useState, useTransition } from "react";
import { createDispute } from "./actions";
import { Toast } from "@/components/toast";

export function CreateDisputeForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const orderId = String(form.get("orderId") ?? "").trim();
    const reason = String(form.get("reason") ?? "").trim();

    startTransition(async () => {
      const result = await createDispute(orderId, reason);
      if (result.error) {
        setError(result.error);
      } else {
        setToast("Dispute logged.");
        setOpen(false);
        (document.getElementById("create-dispute-form") as HTMLFormElement | null)?.reset();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        Log dispute
      </button>
    );
  }

  return (
    <form
      id="create-dispute-form"
      onSubmit={onSubmit}
      className="mb-6 rounded-lg border border-grey-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">
        <input
          name="orderId"
          required
          placeholder="Order ID"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <input
          name="reason"
          required
          placeholder="What's the dispute about?"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {pending ? "Logging…" : "Log dispute"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-grey-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Cancel
        </button>
      </div>
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </form>
  );
}
