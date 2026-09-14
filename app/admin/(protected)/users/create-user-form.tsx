"use client";

import { FormEvent, useState, useTransition } from "react";
import { createAdminUser } from "./actions";

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formId = "create-admin-user-form";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const role = String(form.get("role") ?? "support") as "admin" | "support";

    startTransition(async () => {
      const result = await createAdminUser(name, email, password, role);
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
        Add admin user
      </button>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="mb-6 rounded-lg border border-grey-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Full name"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Initial password"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <select
          name="role"
          defaultValue="support"
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="support">Support (view + disputes only)</option>
          <option value="admin">Admin (full access)</option>
        </select>
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create user"}
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
