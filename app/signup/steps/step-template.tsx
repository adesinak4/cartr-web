"use client";

import { useState } from "react";
import { Theme } from "@/lib/types";
import { IconCheckCircle } from "@/components/icons";

const PREMIUM_THEMES_FEATURE = "premium_themes";

export function StepTemplate({
  themes,
  themeId,
  planFeatures,
  onBack,
  onContinue,
}: {
  themes: Theme[];
  themeId: string | null;
  /** Determines whether premium themes are selectable, same gate cartr-api enforces later. */
  planFeatures: string[];
  onBack: () => void;
  onContinue: (themeId: string | null) => void;
}) {
  const [selectedId, setSelectedId] = useState(themeId);
  const premiumAllowed = planFeatures.includes(PREMIUM_THEMES_FEATURE);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark">Pick a look</h2>
        <p className="mt-1 text-sm text-grey-500">
          You can change your storefront theme anytime — this is just a starting point.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themes.map((theme) => {
          const isSelected = theme.id === selectedId;
          const locked = theme.isPremium && !premiumAllowed;

          return (
            <button
              key={theme.id}
              type="button"
              disabled={locked}
              onClick={() => setSelectedId(theme.id)}
              className={`relative overflow-hidden rounded-lg border text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? "border-blue bg-blue-light" : "border-grey-200 hover:border-grey-300"
              }`}
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-grey-100">
                {theme.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={theme.previewImageUrl}
                    alt={theme.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-grey-400">No preview</span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-dark">{theme.name}</span>
                  {theme.isPremium && (
                    <span className="shrink-0 rounded-full bg-orange-light px-2 py-0.5 text-xs text-orange">
                      Premium
                    </span>
                  )}
                </div>
                {isSelected && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-blue">
                    <IconCheckCircle className="h-3.5 w-3.5" /> Selected
                  </span>
                )}
                {locked && (
                  <span className="mt-1 block text-xs text-grey-400">Included on higher plans</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-grey-200 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Back
        </button>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {selectedId && (
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                onContinue(null);
              }}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-grey-500 transition hover:text-dark"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={() => onContinue(selectedId)}
            className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
