"use client";

import { useState } from "react";
import { Merchant, Theme } from "@/lib/types";
import { StoreInfoForm } from "./store-info-form";
import { ThemePicker } from "./theme-picker";
import { CustomDomainSection } from "./custom-domain-section";
import { PaymentSection } from "./payment-section";
import { NotificationsSection } from "./notifications-section";
import { AccountSection } from "./account-section";

const TABS = ["General", "Payment", "Notifications", "Account"] as const;
type Tab = (typeof TABS)[number];

export function SettingsTabs({
  merchant,
  themes,
}: {
  merchant: Merchant;
  themes: Theme[];
}) {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-grey-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              tab === t
                ? "border-b-2 border-blue text-blue"
                : "text-grey-500 hover:text-dark"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 text-sm font-medium text-grey-500">Store information</h2>
            <StoreInfoForm merchant={merchant} />
          </section>
          <div className="flex flex-col gap-6">
            <section className="rounded-lg bg-white p-6 shadow-card">
              <h2 className="mb-4 text-sm font-medium text-grey-500">Theme</h2>
              <ThemePicker themes={themes} currentThemeId={merchant.themeId} />
            </section>
            <section className="rounded-lg bg-white p-6 shadow-card">
              <h2 className="mb-4 text-sm font-medium text-grey-500">Your domain</h2>
              <CustomDomainSection merchant={merchant} />
            </section>
          </div>
        </div>
      )}

      {tab === "Payment" && (
        <section className="max-w-lg rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Payment settings</h2>
          <PaymentSection merchant={merchant} />
        </section>
      )}

      {tab === "Notifications" && (
        <section className="max-w-lg rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Notification preferences</h2>
          <NotificationsSection />
        </section>
      )}

      {tab === "Account" && (
        <section className="max-w-lg rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Account</h2>
          <AccountSection />
        </section>
      )}
    </div>
  );
}
