import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { Product } from "@/lib/types";
import { ProductsTable } from "./products-table";

export default async function ProductsPage() {
  const products = await apiGet<Product[]>("/products");

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-dark">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Add product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
