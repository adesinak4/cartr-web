import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { AdminTransaction } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { IconCard } from "@/components/icons";

const STATUS_OPTIONS = ["all", "pending", "success", "failed", "refunded"] as const;

export default async function AdminTransactionsPage(props: PageProps<"/admin/transactions">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams?.status === "string" ? searchParams.status : "all";

  const transactions = await apiGet<AdminTransaction[]>(
    `/admin/transactions${status !== "all" ? `?status=${status}` : ""}`,
  );

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Transactions</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/transactions${s === "all" ? "" : `?status=${s}`}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
              status === s
                ? "border-blue bg-blue-light text-blue"
                : "border-grey-200 text-grey-500 hover:border-grey-300"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {transactions.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<IconCard className="h-6 w-6" />} title="No transactions found" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Amount</th>
                <th className="px-4 py-3 font-normal">Platform fee</th>
                <th className="px-4 py-3 font-normal">Provider</th>
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">{tx.merchantStoreName}</td>
                  <td className="px-4 py-3 font-medium text-dark">₦{tx.amount}</td>
                  <td className="px-4 py-3 text-grey-500">₦{tx.platformFee}</td>
                  <td className="px-4 py-3 capitalize text-grey-500">{tx.provider}</td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={tx.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${tx.orderId}`}
                      className="text-sm text-blue hover:underline"
                    >
                      View order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
