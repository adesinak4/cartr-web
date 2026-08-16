import { apiGet } from "@/lib/api-server";
import { Customer, Order } from "@/lib/types";
import { OrdersTable } from "./orders-table";
import { StatCard } from "@/components/stat-card";
import { IconCheckCircle, IconClock, IconReceipt } from "@/components/icons";

export default async function OrdersPage() {
  const [orders, customers] = await Promise.all([
    apiGet<Order[]>("/orders"),
    apiGet<Customer[]>("/customers"),
  ]);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const customerById = new Map(customers.map((c) => [c.id, c]));

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Orders</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<IconReceipt className="h-5 w-5" />}
          color="blue"
          label="Total orders"
          value={orders.length}
        />
        <StatCard
          icon={<IconClock className="h-5 w-5" />}
          color="yellow"
          label="Pending"
          value={pending}
        />
        <StatCard
          icon={<IconCheckCircle className="h-5 w-5" />}
          color="green"
          label="Delivered"
          value={delivered}
        />
      </div>

      <OrdersTable orders={sorted} customerById={Object.fromEntries(customerById)} />
    </div>
  );
}
