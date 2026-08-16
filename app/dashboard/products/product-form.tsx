"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ProductFormState } from "./actions";
import { Product } from "@/lib/types";
import { IconPlus } from "@/components/icons";

const DEFAULT_CATEGORIES = [
  "Dresses",
  "Sets",
  "Kaftans",
  "Blazers",
  "Traditional",
  "Jumpsuits",
];

interface ProductFormProps {
  action: (
    prevState: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  product?: Product;
  submitLabel: string;
}

const initialState: ProductFormState = { error: null };

export function ProductForm({ action, product, submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [categories, setCategories] = useState<string[]>(() =>
    product?.category && !DEFAULT_CATEGORIES.includes(product.category)
      ? [...DEFAULT_CATEGORIES, product.category]
      : DEFAULT_CATEGORIES,
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [category, setCategory] = useState(product?.category ?? "");
  const [published, setPublished] = useState(product ? product.status === "active" : true);
  const [featured, setFeatured] = useState(product?.featured ?? false);

  function confirmNewCategory() {
    const trimmed = newCategory.trim();
    if (trimmed) {
      setCategories((c) => (c.includes(trimmed) ? c : [...c, trimmed]));
      setCategory(trimmed);
    }
    setNewCategory("");
    setAddingCategory(false);
  }

  return (
    <form action={formAction} className="grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-grey-200 p-6">
          <h2 className="mb-4 text-sm font-medium text-dark">Product details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-grey-500">
                Product name
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
                className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm text-grey-500">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product?.description ?? ""}
                className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-sm text-grey-500">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddingCategory((v) => !v)}
                  className="flex shrink-0 items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-sm text-dark transition hover:bg-grey-100"
                >
                  <IconPlus className="h-3.5 w-3.5" /> New
                </button>
              </div>
              {addingCategory && (
                <div className="mt-2 flex gap-2">
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                  <button
                    type="button"
                    onClick={confirmNewCategory}
                    className="shrink-0 rounded-md bg-blue px-3 py-2 text-sm text-white"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="mb-1 block text-sm text-grey-500">
                Stock quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                defaultValue={product?.stock ?? 0}
                className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-grey-200 p-6">
          <h2 className="mb-4 text-sm font-medium text-dark">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="mb-1 block text-sm text-grey-500">
                Price (₦)
              </label>
              <input
                id="price"
                name="price"
                required
                inputMode="decimal"
                defaultValue={product?.price}
                className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
              />
            </div>
            <div>
              <label htmlFor="originalPrice" className="mb-1 block text-sm text-grey-500">
                Compare-at price (₦)
              </label>
              <input
                id="originalPrice"
                name="originalPrice"
                inputMode="decimal"
                defaultValue={product?.originalPrice ?? ""}
                className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
              />
              <p className="mt-1 text-xs text-grey-400">
                Shows a strikethrough &quot;was&quot; price.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-grey-200 p-6">
          <h2 className="mb-4 text-sm font-medium text-dark">Product image</h2>
          <button
            type="button"
            onClick={() => alert("Image upload coming soon.")}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-grey-300 text-sm text-grey-400 transition hover:bg-grey-100"
          >
            <IconPlus className="h-6 w-6" />
            Add product image
          </button>
        </div>

        <div className="rounded-lg border border-grey-200 p-6">
          <h2 className="mb-4 text-sm font-medium text-dark">Visibility</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm text-dark">Published</span>
                <span className="block text-xs text-grey-400">Show in your storefront</span>
              </span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mt-1 h-4 w-8 accent-blue"
              />
            </label>
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm text-dark">Featured</span>
                <span className="block text-xs text-grey-400">
                  Highlight on your store homepage
                </span>
              </span>
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-1 h-4 w-8 accent-blue"
              />
            </label>
          </div>
        </div>

        <input type="hidden" name="status" value={published ? "active" : "draft"} />

        {state.error && <p className="text-sm text-error">{state.error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
          >
            {pending ? "Saving…" : submitLabel}
          </button>
          <Link
            href="/dashboard/products"
            className="flex-1 rounded-md border border-grey-200 px-4 py-2.5 text-center text-sm font-medium text-dark transition hover:bg-grey-100"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
