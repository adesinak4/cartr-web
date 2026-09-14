"use client";

import { FormEvent, useState, useTransition } from "react";
import { upsertSetting } from "./actions";
import { Toast } from "@/components/toast";

export function NewSettingForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formId = "new-setting-form";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const key = String(form.get("key") ?? "");
    const value = String(form.get("value") ?? "");
    const description = String(form.get("description") ?? "");

    startTransition(async () => {
      const result = await upsertSetting(key, value, description || undefined);
      if (result.error) {
        setError(result.error);
      } else {
        (document.getElementById(formId) as HTMLFormElement | null)?.reset();
      }
    });
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="mb-6 grid grid-cols-1 gap-2 rounded-lg border border-dashed border-grey-200 p-4 sm:grid-cols-[1fr_1fr_2fr_auto]"
    >
      <input
        name="key"
        required
        placeholder="key (e.g. whatsapp_number)"
        className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
      />
      <input
        name="value"
        required
        placeholder="value"
        className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
      />
      <input
        name="description"
        placeholder="description (optional)"
        className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      <Toast message={error} variant="error" onDismiss={() => setError(null)} />
    </form>
  );
}
