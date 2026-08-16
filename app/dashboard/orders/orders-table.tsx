"use client";

import { useState } from "react";
import Link from "next/link";
import { Customer, Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { IconReceipt, IconSearch } from "@/components/icons";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function OrdersTable({
  orders,
  customerById,
}: {
  orders: Order[];
  customerById: Record<string, Customer>;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = orders.filter((o) => {
    const customer = customerById[o.customerId];
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (customer?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-lg bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-grey-200 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or order ID…"
            className="w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<IconReceipt className="h-6 w-6" />}
            title="No orders found"
            body={orders.length === 0 ? "No orders yet." : "Try adjusting your filters."}
          />
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-grey-200 text-grey-500">
              <th className="px-4 py-3 font-normal">Order</th>
              <th className="px-4 py-3 font-normal">Customer</th>
              <th className="px-4 py-3 font-normal">Total</th>
              <th className="px-4 py-3 font-normal">Date</th>
              <th className="px-4 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-grey-200 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-mono text-xs text-blue hover:underline"
                  >
                    {order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-grey-500">
                  {customerById[order.customerId]?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {order.currency} {order.total}
                </td>
                <td className="px-4 py-3 text-grey-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Badge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
