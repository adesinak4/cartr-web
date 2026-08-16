import { apiGet } from "@/lib/api-server";
import { AdminMerchant } from "@/lib/types";
import { MerchantsTable } from "./merchants-table";

export default async function AdminMerchantsPage() {
  const merchants = await apiGet<AdminMerchant[]>("/admin/merchants");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Merchants</h1>
      <MerchantsTable merchants={merchants} />
    </div>
  );
}
