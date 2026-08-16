"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { Product } from "@/lib/types";

export interface ProductFormState {
  error: string | null;
}

function readProductForm(formData: FormData) {
  const stock = formData.get("stock");
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    price: String(formData.get("price") ?? "").trim(),
    originalPrice: String(formData.get("originalPrice") ?? "").trim() || undefined,
    category: String(formData.get("category") ?? "").trim() || undefined,
    stock: stock ? Number(stock) : undefined,
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const body = readProductForm(formData);

  if (!body.name || !body.price) {
    return { error: "Name and price are required." };
  }

  const status = formData.get("status");

  try {
    // CreateProductDto has no `status` field — new products always start as
    // `draft` server-side. The create form's "Published" toggle is honored
    // with an immediate follow-up PATCH (which does support status) rather
    // than sending an unknown field the whitelist-strict validator rejects.
    const created = await apiMutate<Product>("/products", "POST", body);
    if (status && String(status) !== created.status) {
      await apiMutate<Product>(`/products/${created.id}`, "PATCH", { status: String(status) });
    }
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create product." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const body = readProductForm(formData);
  const status = formData.get("status");

  if (!body.name || !body.price) {
    return { error: "Name and price are required." };
  }

  try {
    await apiMutate<Product>(`/products/${productId}`, "PATCH", {
      ...body,
      ...(status ? { status: String(status) } : {}),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update product." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(productId: string) {
  await apiMutate(`/products/${productId}`, "DELETE");
  revalidatePath("/dashboard/products");
}
