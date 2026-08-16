import { createProduct } from "../actions";
import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Add product</h1>
      <ProductForm action={createProduct} submitLabel="Add product" />
    </div>
  );
}
