import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import {
  AdminMerchant,
  AdminOrder,
  AdminTransaction,
  PlatformUser,
  SubscriptionCharge,
} from "@/lib/types";
import { SuspendToggleButton } from "../suspend-toggle-button";
import { Badge } from "@/components/badge";
import { IconArrowLeft, IconGlobe } from "@/components/icons";

export default async function AdminMerchantDetailPage(
  props: PageProps<"/admin/merchants/[id]">,
) {
  const { id } = await props.params;
  const [merchant, orders, transactions, users, billingHistory] = await Promise.all([
    apiGet<AdminMerchant>(`/admin/merchants/${id}`),
    apiGet<AdminOrder[]>(`/admin/orders?tenantId=${id}`),
    apiGet<AdminTransaction[]>(`/admin/transactions?tenantId=${id}`),
    apiGet<PlatformUser[]>(`/admin/users?tenantId=${id}`),
    apiGet<SubscriptionCharge[]>(`/admin/merchants/${id}/billing-history`),
  ]);
  const isActive = merchant.accountStatus === "active";

  const initials = merchant.storeName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/merchants"
          className="inline-flex items-center gap-1 text-sm text-grey-500 hover:text-dark"
        >
          <IconArrowLeft className="h-4 w-4" /> Merchants
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-light text-base font-semibold text-blue">
                  {initials}
                </span>
                <div>
                  <p className="text-lg font-semibold text-dark">{merchant.storeName}</p>
                  <p className="text-sm text-grey-400">{merchant.slug}</p>
                </div>
              </div>
              <Badge status={merchant.accountStatus} />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-grey-200 pt-4">
              <div>
                <p className="text-xs text-grey-400">Store</p>
                <p className="mt-1 text-sm font-medium text-dark">{merchant.storeName}</p>
              </div>
              <div>
                <p className="text-xs text-grey-400">Subscription</p>
                <p className="mt-1 text-sm font-medium capitalize text-dark">
                  {merchant.subscriptionStatus.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-grey-400">Joined</p>
                <p className="mt-1 text-sm font-medium text-dark">
                  {new Date(merchant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Admin actions</h2>
            <SuspendToggleButton
              merchantId={merchant.id}
              merchantName={merchant.storeName}
              isActive={isActive}
            />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">
              Recent orders ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-grey-500">No orders yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-t border-grey-200 first:border-0">
                      <td className="py-2">
                        <Link href={`/admin/orders/${order.id}`} className="text-blue hover:underline">
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="py-2 text-grey-500">₦{order.total}</td>
                      <td className="py-2">
                        <Badge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">
              Billing history ({billingHistory.length})
            </h2>
            {billingHistory.length === 0 ? (
              <p className="text-sm text-grey-500">No subscription charges yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <tbody>
                  {billingHistory.slice(0, 5).map((charge) => (
                    <tr key={charge.id} className="border-t border-grey-200 first:border-0">
                      <td className="py-2 text-grey-500">
                        {new Date(charge.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-dark">₦{charge.amount}</td>
                      <td className="py-2">
                        <Badge status={charge.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Contact</h2>
            <a
              href={`/s/${merchant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue hover:underline"
            >
              <IconGlobe className="h-4 w-4 shrink-0" />
              cartr.ng/{merchant.slug}
            </a>
          </div>

          <div
            className={`rounded-lg p-6 ${isActive ? "bg-success-light" : "bg-error-light"}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                isActive ? "text-success" : "text-error"
              }`}
            >
              Account status
            </p>
            <p className={`mt-1 text-lg font-semibold ${isActive ? "text-success" : "text-error"}`}>
              {isActive ? "Active & verified" : "Suspended"}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="text-sm text-grey-500">No users found.</p>
            ) : (
              <ul className="space-y-2">
                {users.map((u) => (
                  <li key={u.id} className="text-sm">
                    <p className="font-medium text-dark">{u.name}</p>
                    <p className="text-xs text-grey-400">
                      {u.email} · <span className="capitalize">{u.role}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">
              Transactions ({transactions.length})
            </h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-grey-500">No transactions yet.</p>
            ) : (
              <ul className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between text-sm">
                    <span className="text-grey-500">₦{tx.amount}</span>
                    <Badge status={tx.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
