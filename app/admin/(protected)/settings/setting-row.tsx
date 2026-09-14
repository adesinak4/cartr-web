"use client";

import { useState, useTransition } from "react";
import { upsertSetting, deleteSetting } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Toast } from "@/components/toast";
import { IconTrash } from "@/components/icons";
import { PlatformSetting } from "@/lib/types";

export function SettingRow({ setting }: { setting: PlatformSetting }) {
  const [value, setValue] = useState(setting.value);
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = value !== setting.value;

  function onSave() {
    startTransition(async () => {
      const result = await upsertSetting(setting.key, value, setting.description ?? undefined);
      if (result.error) setError(result.error);
      else setToast("Saved.");
    });
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deleteSetting(setting.key);
      setConfirmingDelete(false);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-grey-200 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm text-dark">{setting.key}</p>
        {setting.description && (
          <p className="mt-0.5 truncate text-xs text-grey-400">{setting.description}</p>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-56 rounded-md border border-grey-200 px-2 py-1.5 text-sm outline-none focus:border-blue"
      />
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || pending}
        className="rounded-md bg-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-40"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        disabled={pending}
        className="text-grey-400 transition hover:text-error disabled:opacity-40"
        aria-label="Delete setting"
      >
        <IconTrash className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${setting.key}"?`}
        confirmLabel="Delete"
        danger
        pending={pending}
        onConfirm={onDelete}
        onCancel={() => setConfirmingDelete(false)}
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
