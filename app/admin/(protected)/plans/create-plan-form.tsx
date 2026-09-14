"use client";

import { FormEvent, useState, useTransition } from "react";
import { createPlan } from "./actions";

export function CreatePlanForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formId = "create-plan-form";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const monthlyPrice = String(form.get("monthlyPrice") ?? "");
    const transactionFeePercent = String(form.get("transactionFeePercent") ?? "");
    const features = String(form.get("features") ?? "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await createPlan({ name, monthlyPrice, transactionFeePercent, features });
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        (document.getElementById(formId) as HTMLFormElement | null)?.reset();
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
        New plan
      </button>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="mb-6 rounded-lg border border-grey-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          name="name"
          required
          placeholder="Plan name"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <input
          name="monthlyPrice"
          required
          inputMode="decimal"
          placeholder="Legacy monthly price (₦)"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <input
          name="transactionFeePercent"
          required
          inputMode="decimal"
          placeholder="Transaction fee %"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <textarea
        name="features"
        rows={3}
        placeholder="Features, one per line"
        className="mt-3 w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
      />
      <p className="mt-2 text-xs text-grey-400">
        Set period pricing (3/6/12 months) after creating — new plans start with no period prices
        configured.
      </p>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create plan"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-grey-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
