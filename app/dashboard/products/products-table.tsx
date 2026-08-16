"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Badge } from "@/components/badge";
import { EmptyState } from "@/components/empty-state";
import { DeleteProductButton } from "./delete-product-button";
import { IconBox, IconPencil, IconSearch } from "@/components/icons";

export function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products],
  );

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-lg bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-grey-200 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<IconBox className="h-6 w-6" />}
            title="No products found"
            body={
              products.length === 0
                ? "Add your first product to get started."
                : "Try adjusting your search or filters."
            }
            action={
              products.length === 0 ? (
                <Link
                  href="/dashboard/products/new"
                  className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
                >
                  Add product
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-grey-200 text-grey-500">
              <th className="px-4 py-3 font-normal">Product</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-grey-200 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-grey-100 text-grey-400">
                      <IconBox className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-dark">{product.name}</p>
                      {product.description && (
                        <p className="truncate text-xs text-grey-400">{product.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {product.category ? (
                    <span className="rounded-full bg-grey-100 px-2 py-1 text-xs text-grey-500">
                      {product.category}
                    </span>
                  ) : (
                    <span className="text-grey-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">
                  <span className={product.stock <= 3 ? "font-semibold text-error" : ""}>
                    {product.stock <= 3 && product.stock > 0
                      ? `${product.stock} left`
                      : product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={product.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      aria-label="Edit product"
                      className="text-grey-400 transition hover:text-blue"
                    >
                      <IconPencil className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} iconOnly />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
