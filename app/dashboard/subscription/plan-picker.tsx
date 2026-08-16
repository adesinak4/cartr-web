"use client";

import { useState, useTransition } from "react";
import { changePlan } from "./actions";
import { Plan } from "@/lib/types";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IconCheckCircle } from "@/components/icons";

export function PlanPicker({
  plans,
  currentPlanId,
  pendingPlanId,
}: {
  plans: Plan[];
  currentPlanId: string | null;
  pendingPlanId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localPendingId, setLocalPendingId] = useState(pendingPlanId);
  const [confirmingPlan, setConfirmingPlan] = useState<Plan | null>(null);

  function onConfirm() {
    if (!confirmingPlan) return;
    const plan = confirmingPlan;
    setError(null);
    startTransition(async () => {
      const result = await changePlan(plan.id);
      if (result.error) {
        setError(result.error);
      } else {
        setLocalPendingId(plan.id);
      }
      setConfirmingPlan(null);
    });
  }

  const mostPopularId = plans.length > 1 ? plans[plans.length - 1].id : null;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPending = plan.id === localPendingId && !isCurrent;
          const popular = plan.id === mostPopularId;
          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border p-5 ${
                isCurrent ? "border-blue bg-blue-light" : "border-grey-200"
              }`}
            >
              {popular && !isCurrent && (
                <span className="absolute -top-3 left-4 rounded-full bg-orange px-2.5 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}
              <p className="font-medium text-dark">{plan.name}</p>
              <p className="mt-1 text-lg font-semibold text-dark">
                ₦{plan.monthlyPrice}
                <span className="text-sm font-normal text-grey-400"> / month</span>
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
              {isCurrent && (
                <span className="mt-3 inline-block text-xs font-medium text-blue">
                  Current plan
                </span>
              )}
              {isPending && (
                <span className="mt-3 inline-block text-xs text-warning">
                  Takes effect next renewal
                </span>
              )}
              {!isCurrent && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirmingPlan(plan)}
                  className="mt-3 w-full rounded-md border border-grey-200 px-3 py-1.5 text-sm text-dark transition hover:bg-grey-100 disabled:opacity-60"
                >
                  Switch to this plan
                </button>
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}

      <ConfirmDialog
        open={confirmingPlan !== null}
        title={confirmingPlan ? `Switch to ${confirmingPlan.name}?` : ""}
        body="Takes effect at your next renewal date."
        confirmLabel="Switch plan"
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirmingPlan(null)}
      />
    </div>
  );
}
