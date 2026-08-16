import { apiGet } from "@/lib/api-server";
import { Merchant, Theme } from "@/lib/types";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsPage() {
  const [merchant, themes] = await Promise.all([
    apiGet<Merchant>("/merchants/me"),
    apiGet<Theme[]>("/themes"),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Store settings</h1>
      <SettingsTabs merchant={merchant} themes={themes} />
    </div>
  );
}
