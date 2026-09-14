"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OnboardingStatus } from "@/lib/types";
import { IconCheckCircle, IconClock, IconStoreSlash } from "@/components/icons";

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 48; // ~2 minutes

type Phase = "polling" | "loggingIn" | "failed" | "timedOut";

export function ConfirmationClient({ draftId }: { draftId: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("polling");
  const pollCount = useRef(0);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    async function poll() {
      if (cancelled.current) return;

      try {
        const res = await fetch(`/api/onboarding/status?draftId=${encodeURIComponent(draftId)}`);
        const status: OnboardingStatus = await res.json();

        if (status.status === "completed") {
          setPhase("loggingIn");
          const loginRes = await fetch("/api/onboarding/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ draftId }),
          });

          if (loginRes.ok) {
            router.push("/dashboard");
            router.refresh();
            return;
          }
          // Login-exchange failed (e.g. link already used) — send them to a
          // normal login instead of stalling on a broken auto-login.
          router.push("/login");
          return;
        }

        if (status.status === "failed") {
          setPhase("failed");
          return;
        }
      } catch {
        // Transient network hiccup — treated the same as "still pending",
        // just try again on the next tick rather than failing outright.
      }

      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setPhase("timedOut");
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();

    return () => {
      cancelled.current = true;
    };
  }, [draftId, router]);

  if (phase === "failed") {
    return (
      <>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-light text-error">
          <IconStoreSlash className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-dark">Payment didn&apos;t go through</h1>
        <p className="max-w-sm text-sm text-grey-500">
          We couldn&apos;t confirm your payment. No charge should have been made — please try
          signing up again.
        </p>
        <Link
          href="/signup"
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Try again
        </Link>
      </>
    );
  }

  if (phase === "timedOut") {
    return (
      <>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-light text-warning">
          <IconClock className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-dark">Still confirming…</h1>
        <p className="max-w-sm text-sm text-grey-500">
          This is taking longer than usual. Your payment may still be processing — refresh this
          page in a minute, or contact us if it doesn&apos;t resolve.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Refresh
        </button>
      </>
    );
  }

  return (
    <>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-light text-blue">
        {phase === "loggingIn" ? (
          <IconCheckCircle className="h-7 w-7" />
        ) : (
          <IconClock className="h-7 w-7" />
        )}
      </div>
      <h1 className="text-xl font-semibold text-dark">
        {phase === "loggingIn" ? "Payment confirmed!" : "Confirming your payment…"}
      </h1>
      <p className="max-w-sm text-sm text-grey-500">
        {phase === "loggingIn"
          ? "Setting up your dashboard now."
          : "This usually takes a few seconds. Don't close this page."}
      </p>
    </>
  );
}
