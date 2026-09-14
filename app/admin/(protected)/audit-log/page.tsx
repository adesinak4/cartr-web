import { apiGet } from "@/lib/api-server";
import { AuditLog } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { IconClock } from "@/components/icons";

export default async function AuditLogPage(props: PageProps<"/admin/audit-log">) {
  const searchParams = await props.searchParams;
  const entityType = typeof searchParams?.entityType === "string" ? searchParams.entityType : "";

  const logs = await apiGet<AuditLog[]>(
    `/admin/audit-logs${entityType ? `?entityType=${encodeURIComponent(entityType)}` : ""}`,
  );

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold text-dark">Audit log</h1>
      <p className="mb-6 text-sm text-grey-500">Every admin action, who did it, and when.</p>

      <div className="rounded-lg bg-white shadow-card">
        {logs.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<IconClock className="h-6 w-6" />} title="No activity yet" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Action</th>
                <th className="px-4 py-3 font-normal">Entity</th>
                <th className="px-4 py-3 font-normal">Actor role</th>
                <th className="px-4 py-3 font-normal">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-dark">{log.action}</td>
                  <td className="px-4 py-3 text-grey-500">
                    {log.entityType} · {log.entityId.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 capitalize text-grey-500">{log.actorRole ?? "—"}</td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(log.createdAt).toLocaleString()}
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
