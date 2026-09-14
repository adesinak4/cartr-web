"use client";

import { useActionState, useState, useTransition } from "react";
import { createPaymentAccount, resolveAccountName, SettingsFormState } from "./actions";
import { Bank } from "@/lib/types";
import { IconCheckCircle } from "@/components/icons";

const initialState: SettingsFormState = { error: null, success: false };

/**
 * Deliberately reusable outside settings — this is the exact component the
 * onboarding wizard's "how you get paid" step will drop in once it exists,
 * not a settings-specific one-off.
 */
export function PayoutAccountForm({ banks }: { banks: Bank[] }) {
  const [state, formAction, pending] = useActionState(createPaymentAccount, initialState);

  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [resolving, startResolving] = useTransition();

  function onAccountNumberBlur() {
    setResolvedName(null);
    setResolveError(null);

    if (!bankCode || accountNumber.length < 10) return;

    startResolving(async () => {
      const result = await resolveAccountName(bankCode, accountNumber);
      if (result.accountName) {
        setResolvedName(result.accountName);
      } else if (result.error) {
        setResolveError(result.error);
      }
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-grey-500">
        Set up where your storefront sales get paid out. Your subscription is billed
        separately — this is only for money customers pay into your store.
      </p>

      {banks.length === 0 && (
        <p className="rounded-md bg-warning-light px-4 py-3 text-sm text-warning">
          We couldn&apos;t load the bank list right now — try refreshing this page in a moment.
        </p>
      )}

      <div>
        <label htmlFor="bankCode" className="mb-1 block text-sm text-grey-500">
          Bank
        </label>
        <select
          id="bankCode"
          name="bankCode"
          required
          value={bankCode}
          onChange={(e) => {
            const selected = e.target.selectedOptions[0];
            setBankCode(e.target.value);
            setBankName(selected?.dataset.name ?? "");
            setResolvedName(null);
            setResolveError(null);
          }}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="" disabled>
            Select your bank
          </option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code} data-name={bank.name}>
              {bank.name}
            </option>
          ))}
        </select>
        <input type="hidden" name="bankName" value={bankName} />
      </div>

      <div>
        <label htmlFor="accountNumber" className="mb-1 block text-sm text-grey-500">
          Account number
        </label>
        <input
          id="accountNumber"
          name="accountNumber"
          required
          inputMode="numeric"
          maxLength={10}
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            setResolvedName(null);
            setResolveError(null);
          }}
          onBlur={onAccountNumberBlur}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-grey-500">Account name</label>
        {resolving && <p className="text-sm text-grey-400">Looking up account name…</p>}
        {!resolving && resolvedName && (
          <p className="flex items-center gap-1.5 text-sm text-success">
            <IconCheckCircle className="h-4 w-4 shrink-0" />
            {resolvedName}
          </p>
        )}
        {!resolving && resolveError && <p className="text-sm text-error">{resolveError}</p>}
        {!resolving && !resolvedName && !resolveError && (
          <p className="text-sm text-grey-400">
            Enter your bank and account number to verify the name on this account.
          </p>
        )}
        <input type="hidden" name="accountName" value={resolvedName ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessEmail" className="mb-1 block text-sm text-grey-500">
            Business email
          </label>
          <input
            id="businessEmail"
            name="businessEmail"
            type="email"
            required
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label htmlFor="businessMobile" className="mb-1 block text-sm text-grey-500">
            Business phone
          </label>
          <input
            id="businessMobile"
            name="businessMobile"
            type="tel"
            required
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || banks.length === 0 || !resolvedName}
        className="w-fit rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        {pending ? "Setting up…" : "Set up payouts"}
      </button>
    </form>
  );
}
