"use client";

import { useState, useTransition } from "react";
import { suspendMerchant, reactivateMerchant } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";
import { IconCheckCircle, IconStoreSlash } from "@/components/icons";

export function SuspendToggleButton({
  merchantId,
  merchantName,
  isActive,
  iconOnly = false,
}: {
  merchantId: string;
  merchantName: string;
  isActive: boolean;
  iconOnly?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const action = isActive ? "suspend" : "reactivate";
  const verb = isActive ? "Suspend" : "Reactivate";

  function onConfirm() {
    startTransition(async () => {
      const result = isActive
        ? await suspendMerchant(merchantId)
        : await reactivateMerchant(merchantId);
      setConfirming(false);
      if (result.error) {
        setError(result.error);
      } else {
        setToast(`${merchantName} has been ${action}d.`);
      }
    });
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setConfirming(true);
        }}
        disabled={pending}
        className={
          iconOnly
            ? `transition disabled:opacity-60 ${isActive ? "text-error hover:text-error" : "text-success hover:text-success"}`
            : `rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
                isActive
                  ? "border-error text-error hover:bg-error-light"
                  : "border-success text-success hover:bg-success-light"
              }`
        }
      >
        {iconOnly ? (
          isActive ? <IconStoreSlash className="h-4 w-4" /> : <IconCheckCircle className="h-4 w-4" />
        ) : pending ? (
          "Working…"
        ) : (
          `${verb} merchant`
        )}
      </button>
      <ConfirmDialog
        open={confirming}
        title={`${verb} ${merchantName}?`}
        body={`This will ${action} their store and access.`}
        confirmLabel={verb}
        danger={isActive}
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirming(false)}
      />
      <Toast message={toast ?? error} variant={error ? "error" : "success"} onDismiss={() => { setToast(null); setError(null); }} />
    </>
  );
}
