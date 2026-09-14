"use client";

import { useState, useTransition } from "react";
import { markDomainProvisioningDone } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";

export function MarkDoneButton({ taskId, domain }: { taskId: string; domain: string }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onConfirm() {
    startTransition(async () => {
      const result = await markDomainProvisioningDone(taskId);
      setConfirming(false);
      if (result.error) setError(result.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="rounded-md border border-grey-200 px-3 py-1.5 text-xs font-medium text-dark transition hover:bg-grey-100 disabled:opacity-60"
      >
        {pending ? "Working…" : "Mark done"}
      </button>
      <ConfirmDialog
        open={confirming}
        title={`Mark ${domain}.com.ng as provisioned?`}
        body="Confirms the domain has been registered on Truehost and DNS is pointed."
        confirmLabel="Mark done"
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirming(false)}
      />
      <Toast message={error} variant="error" onDismiss={() => setError(null)} />
    </>
  );
}
