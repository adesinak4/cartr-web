"use client";

import { useActionState, useState, useTransition } from "react";
import { setCustomDomain, verifyCustomDomain, SettingsFormState } from "./actions";
import { Merchant } from "@/lib/types";

const initialState: SettingsFormState = { error: null, success: false };

export function CustomDomainSection({ merchant }: { merchant: Merchant }) {
  const [setState, setDomainAction, setPending] = useActionState(
    setCustomDomain,
    initialState,
  );
  const [verifyPending, startVerifyTransition] = useTransition();
  const [verifyError, setVerifyError] = useState<string | null>(null);

  function onCheckNow() {
    setVerifyError(null);
    startVerifyTransition(async () => {
      const result = await verifyCustomDomain();
      if (result.error) setVerifyError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {merchant.customDomain ? (
        <div className="rounded-md border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-dark">{merchant.customDomain}</span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                merchant.customDomainVerified
                  ? "bg-success-light text-success"
                  : "bg-warning-light text-warning"
              }`}
            >
              {merchant.customDomainVerified ? "Verified" : "Pending verification"}
            </span>
          </div>

          {!merchant.customDomainVerified && merchant.customDomainVerificationToken && (
            <div className="mt-4 rounded-md bg-grey-100 p-3 text-sm">
              <p className="mb-2 text-grey-500">
                Add this TXT record at your domain registrar, then check again — this can
                take a few minutes up to a few hours to propagate:
              </p>
              <p className="font-mono text-xs text-dark">
                Name: _cartr-challenge.{merchant.customDomain}
              </p>
              <p className="font-mono text-xs text-dark">
                Value: {merchant.customDomainVerificationToken}
              </p>
            </div>
          )}

          {!merchant.customDomainVerified && (
            <button
              type="button"
              onClick={onCheckNow}
              disabled={verifyPending}
              className="mt-4 rounded-md border border-grey-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-grey-100 disabled:opacity-60"
            >
              {verifyPending ? "Checking…" : "Check now"}
            </button>
          )}
          {verifyError && <p className="mt-2 text-sm text-error">{verifyError}</p>}
        </div>
      ) : (
        <p className="text-sm text-grey-500">No custom domain set yet.</p>
      )}

      <form action={setDomainAction} className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="customDomain" className="mb-1 block text-sm text-grey-500">
            {merchant.customDomain ? "Change domain" : "Add a custom domain"}
          </label>
          <input
            id="customDomain"
            name="customDomain"
            placeholder="mystore.com"
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
        <button
          type="submit"
          disabled={setPending}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {setPending ? "Saving…" : "Save"}
        </button>
      </form>
      {setState.error && <p className="text-sm text-error">{setState.error}</p>}
    </div>
  );
}
