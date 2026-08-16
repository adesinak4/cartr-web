"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminMerchant } from "@/lib/types";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { SuspendToggleButton } from "./suspend-toggle-button";
import { IconBox } from "@/components/icons";

export function MerchantsTable({ merchants }: { merchants: AdminMerchant[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  const filtered = merchants.filter((merchant) => {
    const matchesSearch =
      !search ||
      merchant.storeName.toLowerCase().includes(search.toLowerCase()) ||
      merchant.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || merchant.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by store name or slug…"
          className="flex-1 rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="rounded-lg bg-white shadow-card">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<IconBox className="h-6 w-6" />}
              title="No merchants found"
              body={
                merchants.length === 0 ? "No merchants yet." : "Adjust your search or filters."
              }
            />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Slug</th>
                <th className="px-4 py-3 font-normal">Subscription</th>
                <th className="px-4 py-3 font-normal">Joined</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((merchant) => (
                <tr key={merchant.id} className="border-b border-grey-200 last:border-0">
                  <td className="px-4 py-3">{merchant.storeName}</td>
                  <td className="px-4 py-3 text-grey-500">{merchant.slug}</td>
                  <td className="px-4 py-3 capitalize text-grey-500">
                    {merchant.subscriptionStatus.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={merchant.accountStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/merchants/${merchant.id}`}
                        className="text-sm text-blue hover:underline"
                      >
                        View
                      </Link>
                      <SuspendToggleButton
                        merchantId={merchant.id}
                        merchantName={merchant.storeName}
                        isActive={merchant.accountStatus === "active"}
                        iconOnly
                      />
                    </div>
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
