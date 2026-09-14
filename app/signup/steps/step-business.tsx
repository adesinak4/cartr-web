"use client";

import { useEffect, useRef, useState } from "react";
import { DomainCheckResult } from "@/lib/types";
import { IconCheckCircle, IconGlobe } from "@/components/icons";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

type CheckState = "idle" | "checking" | "available" | "taken" | "unknown";

export function StepBusiness({
  storeName: initialStoreName,
  domain: initialDomain,
  onBack,
  onContinue,
}: {
  storeName: string;
  domain: string;
  onBack: () => void;
  onContinue: (storeName: string, domain: string) => void;
}) {
  const [storeName, setStoreName] = useState(initialStoreName);
  // Domain is derived from storeName until the user edits it directly —
  // after that, manualDomain (their edit) wins and storeName changes stop
  // syncing. Computed during render rather than via an effect+setState.
  const [manualDomain, setManualDomain] = useState<string | null>(
    initialDomain || null,
  );
  const domain = manualDomain ?? slugify(storeName);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [suggestions, setSuggestions] = useState<DomainCheckResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Nothing to check — checkState/suggestions are rendered conditionally
    // on `domain` being non-empty, so no reset needed here.
    if (!domain) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- immediate pending-state flip for the async check kicked off right below
    setCheckState("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/domain-check?domain=${encodeURIComponent(domain)}`);
        const data: DomainCheckResult = await res.json();

        if (data.available === true) {
          setCheckState("available");
          setSuggestions([]);
        } else if (data.available === false) {
          setCheckState("taken");
          const suggestRes = await fetch(
            `/api/domain-check/suggest?businessName=${encodeURIComponent(storeName || domain)}`,
          );
          const suggested: DomainCheckResult[] = await suggestRes.json().catch(() => []);
          setSuggestions(Array.isArray(suggested) ? suggested : []);
        } else {
          // Registry unreachable — an honest "we couldn't verify" state,
          // never coerced to a guessed true/false.
          setCheckState("unknown");
          setSuggestions([]);
        }
      } catch {
        setCheckState("unknown");
        setSuggestions([]);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  function pickSuggestion(suggested: DomainCheckResult) {
    const label = suggested.domain.replace(/\.com\.ng$/, "");
    setManualDomain(label);
  }

  function onContinueClick() {
    if (!storeName.trim()) {
      setError("Store name is required.");
      return;
    }
    if (!domain) {
      setError("Choose a domain for your store.");
      return;
    }
    if (checkState === "taken") {
      setError("That domain is taken — pick one of the alternatives below.");
      return;
    }
    setError(null);
    onContinue(storeName.trim(), domain);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark">Your business</h2>
        <p className="mt-1 text-sm text-grey-500">What should customers call your store?</p>
      </div>

      <div>
        <label htmlFor="storeName" className="mb-1 block text-sm text-grey-500">
          Store name
        </label>
        <input
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="domain" className="mb-1 block text-sm text-grey-500">
          Your domain
        </label>
        <div className="flex items-center rounded-md border border-grey-200 pl-3 pr-1 focus-within:border-blue">
          <IconGlobe className="h-4 w-4 shrink-0 text-grey-400" />
          <input
            id="domain"
            value={domain}
            onChange={(e) => setManualDomain(slugify(e.target.value))}
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          />
          <span className="shrink-0 whitespace-nowrap py-2 pr-2 text-sm text-grey-400">
            .com.ng
          </span>
        </div>

        <div className="mt-2 min-h-[1.25rem] text-xs">
          {domain && checkState === "checking" && (
            <span className="text-grey-400">Checking availability…</span>
          )}
          {domain && checkState === "available" && (
            <span className="flex items-center gap-1 text-success">
              <IconCheckCircle className="h-3.5 w-3.5" /> Available
            </span>
          )}
          {domain && checkState === "taken" && (
            <span className="text-error">That domain is already taken.</span>
          )}
          {domain && checkState === "unknown" && (
            <span className="text-grey-400">
              Couldn&apos;t verify availability right now — we&apos;ll confirm before your store
              goes live.
            </span>
          )}
        </div>

        {domain && checkState === "taken" && suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.domain}
                type="button"
                onClick={() => pickSuggestion(s)}
                className="rounded-full border border-grey-200 px-3 py-1 text-xs text-dark transition hover:border-blue hover:text-blue"
              >
                {s.domain}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-grey-200 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinueClick}
          className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
