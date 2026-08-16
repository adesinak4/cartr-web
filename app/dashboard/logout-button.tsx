"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IconLogout } from "@/components/icons";

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
}

export function LogoutButton({
  redirectTo = "/login",
  className = "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-grey-500 transition hover:bg-grey-100 disabled:opacity-60",
}: LogoutButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setConfirming(true)} disabled={loading} className={className}>
        <IconLogout className="h-4 w-4" />
        {loading ? "Logging out…" : "Log out"}
      </button>
      <ConfirmDialog
        open={confirming}
        title="Log out?"
        body="You will be returned to the login screen."
        confirmLabel="Log out"
        pending={loading}
        onConfirm={onLogout}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
