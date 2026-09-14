import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { AdminOrder } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { IconReceipt } from "@/components/icons";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams?.status === "string" ? searchParams.status : "all";

  const orders = await apiGet<AdminOrder[]>(
    `/admin/orders${status !== "all" ? `?status=${status}` : ""}`,
  );

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/orders${s === "all" ? "" : `?status=${s}`}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
              status === s
                ? "border-blue bg-blue-light text-blue"
                : "border-grey-200 text-grey-500 hover:border-grey-300"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {orders.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<IconReceipt className="h-6 w-6" />} title="No orders found" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">{order.merchantStoreName}</td>
                  <td className="px-4 py-3 font-medium text-dark">
                    ₦{order.total} <span className="text-grey-400">{order.currency}</span>
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-blue hover:underline"
                    >
                      View
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
