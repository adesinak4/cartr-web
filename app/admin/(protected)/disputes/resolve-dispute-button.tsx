"use client";

import { useState, useTransition } from "react";
import { resolveDispute } from "./actions";

export function ResolveDisputeButton({ disputeId }: { disputeId: string }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onResolve() {
    if (!notes.trim()) {
      setError("Add a resolution note first.");
      return;
    }
    startTransition(async () => {
      const result = await resolveDispute(disputeId, notes.trim());
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-grey-200 px-3 py-1.5 text-xs font-medium text-dark transition hover:bg-grey-100"
      >
        Resolve
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="How was this resolved?"
        className="w-64 rounded-md border border-grey-200 px-2 py-1.5 text-xs outline-none focus:border-blue"
      />
      {error && <p className="text-xs text-error">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-grey-200 px-3 py-1.5 text-xs font-medium text-dark transition hover:bg-grey-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onResolve}
          disabled={pending}
          className="rounded-md bg-blue px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
