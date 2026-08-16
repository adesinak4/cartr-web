"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PublicProduct } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart-button";
import { EmptyState } from "@/components/empty-state";
import { IconBox } from "@/components/icons";

export function ProductGrid({ slug, products }: { slug: string; products: PublicProduct[] }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter((c): c is string => !!c));
    return Array.from(set);
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-dark">All Products</h2>
        <span className="text-sm text-grey-400">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 rounded-full border px-3 py-1 text-sm transition ${
            activeCategory === null
              ? "border-blue bg-blue text-white"
              : "border-grey-200 text-dark hover:bg-grey-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-full border px-3 py-1 text-sm transition ${
              activeCategory === category
                ? "border-blue bg-blue text-white"
                : "border-grey-200 text-dark hover:bg-grey-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconBox className="h-6 w-6" />}
          title="No items"
          body={products.length === 0 ? "No products available yet." : "No items in this category."}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <div key={product.id} className="rounded-lg border border-grey-200 p-3">
              <Link href={`/s/${slug}/product/${product.id}`}>
                <div className="mb-2 flex aspect-square items-center justify-center rounded-md bg-grey-100">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🛍️</span>
                  )}
                </div>
                <p className="text-sm font-medium text-dark">{product.name}</p>
                {product.description && (
                  <p className="line-clamp-2 text-xs text-grey-400">{product.description}</p>
                )}
                <p className="mt-1 text-sm text-grey-500">
                  {product.price}
                  {product.originalPrice && (
                    <span className="ml-2 text-xs text-grey-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </p>
              </Link>
              <div className="mt-2">
                <AddToCartButton
                  slug={slug}
                  product={{ id: product.id, name: product.name, price: product.price }}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
