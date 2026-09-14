import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { Dispute } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { IconFlag } from "@/components/icons";
import { CreateDisputeForm } from "./create-dispute-form";
import { ResolveDisputeButton } from "./resolve-dispute-button";

export default async function DisputesPage(props: PageProps<"/admin/disputes">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams?.status === "string" ? searchParams.status : "open";

  const disputes = await apiGet<Dispute[]>(`/admin/disputes?status=${status}`);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Disputes</h1>
          <p className="mt-1 text-sm text-grey-500">
            Manually tracked — logged when a customer or merchant reaches out about an order.
          </p>
        </div>
        <CreateDisputeForm />
      </div>

      <div className="mb-4 inline-flex rounded-md border border-grey-200 bg-white p-1">
        {(["open", "resolved"] as const).map((s) => (
          <Link
            key={s}
            href={`/admin/disputes?status=${s}`}
            className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition ${
              status === s ? "bg-blue text-white" : "text-grey-500 hover:text-dark"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {disputes.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<IconFlag className="h-6 w-6" />} title="Nothing here" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Reason</th>
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal">Logged</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">{d.merchantStoreName ?? "—"}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-grey-500">{d.reason}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${d.orderId}`}
                      className="text-blue hover:underline"
                    >
                      View order
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {d.status === "open" && <ResolveDisputeButton disputeId={d.id} />}
                    {d.status === "resolved" && d.resolutionNotes && (
                      <p className="max-w-xs truncate text-xs text-grey-400">
                        {d.resolutionNotes}
                      </p>
                    )}
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
