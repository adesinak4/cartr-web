import { apiGet } from "@/lib/api-server";
import { Merchant, Theme, PaymentAccount, Bank } from "@/lib/types";
import { ApiError } from "@/lib/api-client";
import { SettingsTabs } from "./settings-tabs";

async function getPaymentAccount(): Promise<PaymentAccount | null> {
  try {
    return await apiGet<PaymentAccount>("/payment-accounts/me");
  } catch (err) {
    // No payout account set up yet is a normal, common state — not an error.
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

async function getBanks(): Promise<Bank[]> {
  try {
    return await apiGet<Bank[]>("/payment-accounts/banks");
  } catch {
    // Flutterwave being briefly unreachable (or, in local dev, a placeholder
    // key) shouldn't take down the whole settings page — the payout form
    // just shows its own honest "couldn't load banks" state instead.
    return [];
  }
}

export default async function SettingsPage() {
  const [merchant, themes, paymentAccount, banks] = await Promise.all([
    apiGet<Merchant>("/merchants/me"),
    apiGet<Theme[]>("/themes"),
    getPaymentAccount(),
    getBanks(),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Store settings</h1>
      <SettingsTabs
        merchant={merchant}
        themes={themes}
        paymentAccount={paymentAccount}
        banks={banks}
      />
    </div>
  );
}
