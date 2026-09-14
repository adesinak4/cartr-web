import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { DomainProvisioningTask } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { IconGlobe } from "@/components/icons";
import { MarkDoneButton } from "./mark-done-button";

export default async function DomainProvisioningPage(
  props: PageProps<"/admin/domain-provisioning">,
) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams?.status === "string" ? searchParams.status : "pending";

  const tasks = await apiGet<DomainProvisioningTask[]>(
    `/admin/domain-provisioning?status=${status}`,
  );

  const tabs: { value: string; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold text-dark">Domain provisioning</h1>
      <p className="mb-6 text-sm text-grey-500">
        Every real signup lands here waiting on manual Truehost registration + DNS pointing.
      </p>

      <div className="mb-4 inline-flex rounded-md border border-grey-200 bg-white p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/domain-provisioning?status=${tab.value}`}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              status === tab.value ? "bg-blue text-white" : "text-grey-500 hover:text-dark"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {tasks.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<IconGlobe className="h-6 w-6" />}
              title={status === "pending" ? "Nothing pending" : "No completed tasks yet"}
              body={
                status === "pending"
                  ? "New signups will show up here as soon as they pay."
                  : undefined
              }
            />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Domain</th>
                <th className="px-4 py-3 font-normal">Requested</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/merchants/${task.merchantId}`}
                      className="text-blue hover:underline"
                    >
                      {task.merchantStoreName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-grey-500">{task.desiredDomain}.com.ng</td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={task.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {task.status === "pending" && (
                      <MarkDoneButton taskId={task.id} domain={task.desiredDomain} />
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
