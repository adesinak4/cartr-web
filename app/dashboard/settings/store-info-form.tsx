"use client";

import { useActionState } from "react";
import { updateStoreInfo, SettingsFormState } from "./actions";
import { Merchant } from "@/lib/types";

const initialState: SettingsFormState = { error: null, success: false };

export function StoreInfoForm({ merchant }: { merchant: Merchant }) {
  const [state, formAction, pending] = useActionState(updateStoreInfo, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="storeName" className="mb-1 block text-sm text-grey-500">
          Store name
        </label>
        <input
          id="storeName"
          name="storeName"
          required
          defaultValue={merchant.storeName}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-grey-500">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={merchant.description ?? ""}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="logoUrl" className="mb-1 block text-sm text-grey-500">
          Logo URL
        </label>
        <input
          id="logoUrl"
          name="logoUrl"
          defaultValue={merchant.logoUrl ?? ""}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm text-grey-500">
          Address
        </label>
        <input
          id="address"
          name="address"
          defaultValue={merchant.address ?? ""}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-grey-500">
        <input type="checkbox" name="isOpen" defaultChecked={merchant.isOpen} />
        Store is open
      </label>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
