import { apiGet } from "@/lib/api-server";
import { Product } from "@/lib/types";
import { updateProduct } from "../../actions";
import { ProductForm } from "../../product-form";
import { DeleteProductButton } from "../../delete-product-button";

export default async function EditProductPage(
  props: PageProps<"/dashboard/products/[id]/edit">,
) {
  const { id } = await props.params;
  const product = await apiGet<Product>(`/products/${id}`);
  const boundAction = updateProduct.bind(null, id);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-dark">Edit: {product.name}</h1>
        <DeleteProductButton
          productId={product.id}
          productName={product.name}
          redirectAfter="/dashboard/products"
          className="rounded-md border border-error px-4 py-2 text-sm font-medium text-error transition hover:bg-error-light"
        />
      </div>
      <ProductForm action={boundAction} product={product} submitLabel="Save changes" />
    </div>
  );
}
