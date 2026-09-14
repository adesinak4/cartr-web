"use client";

import { useState, useTransition } from "react";
import { updatePlanDetails, archivePlan, unarchivePlan } from "./actions";
import { PriceRow } from "./price-row";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";
import { AdminPlanWithPrices } from "@/lib/types";

const PERIOD_ORDER = [3, 6, 12];

export function PlanCard({ plan }: { plan: AdminPlanWithPrices }) {
  const [name, setName] = useState(plan.name);
  const [fee, setFee] = useState(plan.transactionFeePercent);
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [pending, startTransition] = useTransition();
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    name !== plan.name ||
    fee !== plan.transactionFeePercent ||
    features !== plan.features.join("\n");

  const sortedPrices = [...plan.prices].sort(
    (a, b) => PERIOD_ORDER.indexOf(a.periodMonths) - PERIOD_ORDER.indexOf(b.periodMonths),
  );

  function onSaveDetails() {
    startTransition(async () => {
      const result = await updatePlanDetails(plan.id, {
        name,
        transactionFeePercent: fee,
        features: features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      if (result.error) setError(result.error);
      else setToast("Plan updated.");
    });
  }

  function onToggleArchive() {
    startTransition(async () => {
      const result = plan.archivedAt ? await unarchivePlan(plan.id) : await archivePlan(plan.id);
      setConfirmingArchive(false);
      if (result.error) setError(result.error);
      else setToast(plan.archivedAt ? "Plan restored." : "Plan archived.");
    });
  }

  return (
    <div
      className={`rounded-lg bg-white p-6 shadow-card ${plan.archivedAt ? "opacity-60" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-lg font-semibold text-dark outline-none focus:border-b focus:border-blue"
        />
        {plan.archivedAt && (
          <span className="shrink-0 rounded-full bg-grey-100 px-2 py-0.5 text-xs text-grey-500">
            Archived
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          inputMode="decimal"
          className="w-16 rounded-md border border-grey-200 px-2 py-1 text-sm outline-none focus:border-blue"
        />
        <span className="text-xs text-grey-400">% per storefront transaction</span>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs text-grey-400">Features (one per line)</label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-grey-200 px-2 py-1.5 text-sm outline-none focus:border-blue"
        />
      </div>

      <button
        type="button"
        onClick={onSaveDetails}
        disabled={!dirty || pending}
        className="mb-4 rounded-md bg-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-40"
      >
        {pending ? "Saving…" : "Save details"}
      </button>

      <div className="border-t border-grey-200 pt-2">
        {sortedPrices.length === 0 ? (
          <p className="py-2 text-sm text-grey-500">No period pricing configured yet.</p>
        ) : (
          sortedPrices.map((price) => <PriceRow key={price.id} planId={plan.id} price={price} />)
        )}
      </div>

      <button
        type="button"
        onClick={() => setConfirmingArchive(true)}
        disabled={pending}
        className="mt-4 text-xs font-medium text-grey-400 hover:text-error disabled:opacity-40"
      >
        {plan.archivedAt ? "Restore plan" : "Archive plan"}
      </button>

      <ConfirmDialog
        open={confirmingArchive}
        title={plan.archivedAt ? `Restore ${plan.name}?` : `Archive ${plan.name}?`}
        body={
          plan.archivedAt
            ? "Makes this plan selectable again in the signup wizard."
            : "Removes this plan from the signup wizard and dashboard picker. Merchants already on it are unaffected."
        }
        confirmLabel={plan.archivedAt ? "Restore" : "Archive"}
        danger={!plan.archivedAt}
        pending={pending}
        onConfirm={onToggleArchive}
        onCancel={() => setConfirmingArchive(false)}
      />
      <Toast
        message={toast ?? error}
        variant={error ? "error" : "success"}
        onDismiss={() => {
          setToast(null);
          setError(null);
        }}
      />
    </div>
  );
}
