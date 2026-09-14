import { apiGet } from "@/lib/api-server";
import { PlatformSetting } from "@/lib/types";
import { SettingRow } from "./setting-row";
import { NewSettingForm } from "./new-setting-form";

export default async function PlatformSettingsPage() {
  const settings = await apiGet<PlatformSetting[]>("/admin/settings");

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold text-dark">Platform settings</h1>
      <p className="mb-6 max-w-2xl text-sm text-grey-500">
        Arbitrary key-value config. Note: existing code (e.g. the support WhatsApp number shown
        on public pages) doesn&apos;t read from here yet — this page only manages storage.
      </p>

      <NewSettingForm />

      <div className="rounded-lg bg-white p-4 shadow-card">
        {settings.length === 0 ? (
          <p className="p-4 text-sm text-grey-500">No settings configured yet.</p>
        ) : (
          settings.map((setting) => <SettingRow key={setting.key} setting={setting} />)
        )}
      </div>
    </div>
  );
}
