"use client";

import { useState } from "react";
import { Toast } from "@/components/toast";

const PREFERENCES = [
  { key: "newOrder", label: "New order", hint: "Get notified the moment a customer orders." },
  {
    key: "paymentConfirmed",
    label: "Payment confirmed",
    hint: "Get notified when a payment clears.",
  },
  { key: "lowStock", label: "Low stock alert", hint: "Get notified when a product is running low." },
  { key: "weeklySummary", label: "Weekly summary", hint: "A weekly recap of your store's activity." },
];

export function NotificationsSection() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    newOrder: true,
    paymentConfirmed: true,
    lowStock: true,
    weeklySummary: false,
  });
  const [toast, setToast] = useState<string | null>(null);

  function toggle(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setToast("Preference saved.");
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-grey-400">
        Notification preferences are stored on this device for now — a synced, server-backed
        version is coming soon.
      </p>
      {PREFERENCES.map((p) => (
        <label key={p.key} className="flex items-start justify-between gap-4">
          <span>
            <span className="block text-sm text-dark">{p.label}</span>
            <span className="block text-xs text-grey-400">{p.hint}</span>
          </span>
          <input
            type="checkbox"
            checked={prefs[p.key]}
            onChange={() => toggle(p.key)}
            className="mt-1 h-4 w-8 accent-blue"
          />
        </label>
      ))}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
