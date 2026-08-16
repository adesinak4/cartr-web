"use client";

import { useState, useTransition } from "react";
import { selectTheme } from "./actions";
import { Theme } from "@/lib/types";

export function ThemePicker({
  themes,
  currentThemeId,
}: {
  themes: Theme[];
  currentThemeId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(currentThemeId);

  function onSelect(theme: Theme) {
    setError(null);
    startTransition(async () => {
      const result = await selectTheme(theme.id);
      if (result.error) {
        // THEME_NOT_ALLOWED surfaces here as a plain message — the plan's
        // requirement to handle it cleanly rather than a generic crash.
        setError(result.error);
      } else {
        setSelectedId(theme.id);
      }
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themes.map((theme) => {
          const isSelected = theme.id === selectedId;
          return (
            <button
              key={theme.id}
              type="button"
              disabled={pending}
              onClick={() => onSelect(theme)}
              className={`rounded-lg border p-3 text-left text-sm transition disabled:opacity-60 ${
                isSelected
                  ? "border-blue bg-blue-light"
                  : "border-grey-200 hover:border-grey-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-dark">{theme.name}</span>
                {theme.isPremium && (
                  <span className="rounded-full bg-orange-light px-2 py-0.5 text-xs text-orange">
                    Premium
                  </span>
                )}
              </div>
              {isSelected && (
                <span className="mt-1 block text-xs text-blue">Selected</span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
    </div>
  );
}
