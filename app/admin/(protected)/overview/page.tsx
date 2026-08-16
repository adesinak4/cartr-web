import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { AdminMerchant } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/badge";
import { IconBox, IconCheckCircle } from "@/components/icons";

export default async function AdminOverviewPage() {
  const merchants = await apiGet<AdminMerchant[]>("/admin/merchants");
  const active = merchants.filter((m) => m.accountStatus === "active");
  const activePercent = merchants.length
    ? Math.round((active.length / merchants.length) * 100)
    : 0;
  const recent = [...merchants]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Platform overview</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={<IconBox className="h-5 w-5" />}
          color="blue"
          label="Total merchants"
          value={merchants.length}
        />
        <StatCard
          icon={<IconCheckCircle className="h-5 w-5" />}
          color="green"
          label="Active stores"
          value={active.length}
          change={`${activePercent}% active rate`}
          changeTone="positive"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-lg bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-grey-500">Recent merchants</h2>
            <Link href="/admin/merchants" className="text-sm text-blue hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-grey-500">No merchants yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-grey-500">
                  <th className="pb-2 font-normal">Store</th>
                  <th className="pb-2 font-normal">Status</th>
                  <th className="pb-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((m) => (
                  <tr key={m.id} className="border-t border-grey-200">
                    <td className="py-2">{m.storeName}</td>
                    <td className="py-2">
                      <Badge status={m.accountStatus} />
                    </td>
                    <td className="py-2 text-right">
                      <Link href={`/admin/merchants/${m.id}`} className="text-blue hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-3 text-sm font-medium text-grey-500">Quick links</h2>
          <Link
            href="/admin/merchants"
            className="block rounded-md bg-blue px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-dark"
          >
            Merchants
          </Link>
        </div>
      </div>
    </div>
  );
}
