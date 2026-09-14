import { apiGet } from "@/lib/api-server";
import { PlatformUser } from "@/lib/types";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { IconUsers } from "@/components/icons";
import { CreateUserForm } from "./create-user-form";
import { StatusToggleButton } from "./status-toggle-button";

export default async function AdminUsersPage() {
  const users = await apiGet<PlatformUser[]>("/admin/users");

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Admin users</h1>
          <p className="mt-1 text-sm text-grey-500">
            Who has access to this dashboard, and at what tier.
          </p>
        </div>
        <CreateUserForm />
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {users.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<IconUsers className="h-6 w-6" />} title="No admin users yet" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Role</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-grey-500">{user.email}</td>
                  <td className="px-4 py-3 capitalize text-grey-500">{user.role}</td>
                  <td className="px-4 py-3">
                    <Badge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusToggleButton
                      userId={user.id}
                      userName={user.name}
                      isActive={user.status === "active"}
                    />
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
