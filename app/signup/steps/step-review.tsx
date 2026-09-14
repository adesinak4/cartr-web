"use client";

import { useState } from "react";
import { Plan, Theme, BillingPeriodMonths } from "@/lib/types";
import { WizardData } from "../wizard-types";

const PERIOD_LABELS: Record<BillingPeriodMonths, string> = {
  3: "3 months",
  6: "6 months",
  12: "12 months",
};

export function StepReview({
  data,
  password,
  googleIdToken,
  plan,
  theme,
  onBack,
}: {
  data: WizardData;
  password: string;
  googleIdToken?: string;
  plan: Plan;
  theme: Theme | null;
  onBack: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = plan.prices.find((p) => p.periodMonths === data.periodMonths);

  async function onPay() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: googleIdToken ? undefined : password,
          googleIdToken,
          storeName: data.storeName,
          domain: data.domain,
          planId: data.planId,
          periodMonths: data.periodMonths,
          themeId: data.themeId ?? undefined,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(body?.message ?? "Could not start payment. Please try again.");
      }

      window.location.href = body.paymentLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark">Review & pay</h2>
        <p className="mt-1 text-sm text-grey-500">
          Check everything looks right, then complete payment to create your store.
        </p>
      </div>

      <div className="rounded-lg border border-grey-200 divide-y divide-grey-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-dark">{plan.name} plan</p>
            <p className="text-xs text-grey-400">
              Billed every {PERIOD_LABELS[data.periodMonths ?? 3]}
            </p>
          </div>
          <p className="text-sm font-semibold text-dark">
            {price ? `₦${price.totalPrice}` : "—"}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-grey-400">Owner</p>
          <p className="mt-1 text-sm text-dark">
            {data.firstName} {data.lastName}
          </p>
          <p className="text-sm text-grey-500">{data.email}</p>
          <p className="text-sm text-grey-500">{data.phone}</p>
          {googleIdToken && <p className="mt-1 text-xs text-success">Signed in with Google</p>}
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-grey-400">Store</p>
          <p className="mt-1 text-sm text-dark">{data.storeName}</p>
          <p className="text-sm text-grey-500">{data.domain}.com.ng</p>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-grey-400">Template</p>
          <p className="mt-1 text-sm text-dark">{theme ? theme.name : "Default (can change later)"}</p>
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-md border border-grey-200 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-grey-100 disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onPay}
          disabled={submitting}
          className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {submitting ? "Starting payment…" : "Continue to payment"}
        </button>
      </div>

      <p className="text-center text-xs text-grey-400">
        By continuing you agree to Cartr&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
