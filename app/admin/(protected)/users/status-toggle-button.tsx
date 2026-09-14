"use client";

import { useState, useTransition } from "react";
import { setUserStatus } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";

export function StatusToggleButton({
  userId,
  userName,
  isActive,
}: {
  userId: string;
  userName: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = isActive ? "disabled" : "active";
  const verb = isActive ? "Deactivate" : "Activate";

  function onConfirm() {
    startTransition(async () => {
      const result = await setUserStatus(userId, action);
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
        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
          isActive
            ? "border-error text-error hover:bg-error-light"
            : "border-success text-success hover:bg-success-light"
        }`}
      >
        {pending ? "Working…" : verb}
      </button>
      <ConfirmDialog
        open={confirming}
        title={`${verb} ${userName}?`}
        danger={isActive}
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirming(false)}
      />
      <Toast message={error} variant="error" onDismiss={() => setError(null)} />
    </>
  );
}
