import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { Customer, Merchant, Product, SubscriptionSummary, Order } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/badge";
import { IconBox, IconClock, IconPlus, IconReceipt } from "@/components/icons";

const STATUS_LABELS: Record<SubscriptionSummary["subscriptionStatus"], string> = {
  trialing: "Trial",
  active: "Active",
  past_due: "Past due",
  cancelled: "Cancelled",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardHomePage() {
  const [merchant, subscription, orders, products, customers] = await Promise.all([
    apiGet<Merchant>("/merchants/me"),
    apiGet<SubscriptionSummary>("/subscriptions/me"),
    apiGet<Order[]>("/orders"),
    apiGet<Product[]>("/products"),
    apiGet<Customer[]>("/customers"),
  ]);

  const customerById = new Map(customers.map((c) => [c.id, c]));
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const recentOrders = sorted.slice(0, 4);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-dark">
        {greeting()}, {merchant.storeName}
      </h1>
      <p className="mt-1 text-sm text-grey-500">Here&apos;s how your store is doing today.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<IconBox className="h-5 w-5" />}
          color="green"
          label="Products listed"
          value={products.length}
        />
        <StatCard
          icon={<IconClock className="h-5 w-5" />}
          color="yellow"
          label="Pending orders"
          value={pendingCount}
          change={pendingCount > 0 ? "Needs attention" : undefined}
          changeTone="warning"
        />
        <StatCard
          icon={<IconReceipt className="h-5 w-5" />}
          color="orange"
          label="Total orders"
          value={orders.length}
        />
        <StatCard
          icon={<IconClock className="h-5 w-5" />}
          color="blue"
          label="Subscription"
          value={STATUS_LABELS[subscription.subscriptionStatus]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Recent orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-grey-500">No orders yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-grey-500">
                  <th className="pb-2 font-normal">Order</th>
                  <th className="pb-2 font-normal">Customer</th>
                  <th className="pb-2 font-normal">Status</th>
                  <th className="pb-2 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-grey-200">
                    <td className="py-2">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="font-mono text-xs text-blue hover:underline"
                      >
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-2 text-grey-500">
                      {customerById.get(order.customerId)?.name ?? "—"}
                    </td>
                    <td className="py-2">
                      <Badge status={order.status} />
                    </td>
                    <td className="py-2">
                      {order.currency} {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Quick actions</h2>
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard/products/new"
                className="flex items-center gap-2 rounded-md border border-grey-200 px-3 py-2 text-sm text-dark transition hover:bg-grey-100"
              >
                <IconPlus className="h-4 w-4" /> Add product
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-2 rounded-md border border-grey-200 px-3 py-2 text-sm text-dark transition hover:bg-grey-100"
              >
                <IconReceipt className="h-4 w-4" /> View orders
              </Link>
              <a
                href={`/s/${merchant.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-grey-200 px-3 py-2 text-sm text-dark transition hover:bg-grey-100"
              >
                Visit storefront
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-blue p-6 text-white shadow-card">
            <p className="text-xs uppercase tracking-wide text-white/70">Current plan</p>
            <p className="mt-1 text-lg font-medium">
              {STATUS_LABELS[subscription.subscriptionStatus]}
            </p>
            {subscription.nextRenewalAt && (
              <p className="mt-1 text-xs text-white/70">
                Renews {new Date(subscription.nextRenewalAt).toLocaleDateString()}
              </p>
            )}
            <Link
              href="/dashboard/subscription"
              className="mt-4 inline-block rounded-md bg-white px-3 py-2 text-sm font-medium text-blue transition hover:bg-white/90"
            >
              Upgrade plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
