"use client";

import { useMemo, useState } from "react";
import { Plan, BillingPeriodMonths } from "@/lib/types";
import { IconCheckCircle } from "@/components/icons";

const PERIOD_LABELS: Record<BillingPeriodMonths, string> = {
  3: "3 months",
  6: "6 months",
  12: "12 months",
};

export function StepPlan({
  plans,
  planId,
  periodMonths,
  onContinue,
}: {
  plans: Plan[];
  planId: string;
  periodMonths: BillingPeriodMonths | null;
  onContinue: (planId: string, periodMonths: BillingPeriodMonths) => void;
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(planId);
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriodMonths>(periodMonths ?? 3);

  const availablePeriods = useMemo(() => {
    const periods = new Set<BillingPeriodMonths>();
    plans.forEach((p) => p.prices.forEach((price) => periods.add(price.periodMonths)));
    return [3, 6, 12].filter((p): p is BillingPeriodMonths =>
      periods.has(p as BillingPeriodMonths),
    );
  }, [plans]);

  const mostPopularId = plans.length > 1 ? plans[plans.length - 1].id : null;

  function priceFor(plan: Plan) {
    return plan.prices.find((p) => p.periodMonths === selectedPeriod) ?? null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-dark">Choose your plan</h2>
      <p className="mt-1 text-sm text-grey-500">
        Pick a plan and billing period — you can change plans later from your dashboard.
      </p>

      <div className="mt-6 inline-flex rounded-md border border-grey-200 p-1">
        {availablePeriods.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => setSelectedPeriod(period)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              selectedPeriod === period
                ? "bg-blue text-white"
                : "text-grey-500 hover:text-dark"
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = priceFor(plan);
          const isSelected = plan.id === selectedPlanId;
          const popular = plan.id === mostPopularId;

          return (
            <button
              key={plan.id}
              type="button"
              disabled={!price}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative rounded-lg border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? "border-blue bg-blue-light" : "border-grey-200 hover:border-grey-300"
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-4 rounded-full bg-orange px-2.5 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}
              <p className="font-medium text-dark">{plan.name}</p>
              <p className="mt-1 text-lg font-semibold text-dark">
                {price ? `₦${price.totalPrice}` : "Unavailable"}
                {price && (
                  <span className="text-sm font-normal text-grey-400">
                    {" "}
                    / {PERIOD_LABELS[selectedPeriod]}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-grey-400">
                {plan.transactionFeePercent}% per transaction
              </p>
              {plan.features?.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-xs text-grey-500">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <IconCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedPlanId}
        onClick={() => onContinue(selectedPlanId, selectedPeriod)}
        className="mt-8 w-full rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60 sm:w-auto"
      >
        Continue
      </button>
    </div>
  );
}
