import { apiPublicGet } from "@/lib/api-public";
import { PublicProduct, PublicStorefront } from "@/lib/types";
import { ProductGrid } from "./product-grid";

export default async function StorefrontHomePage(props: PageProps<"/s/[slug]">) {
  const { slug } = await props.params;
  const [storefront, products] = await Promise.all([
    apiPublicGet<PublicStorefront>(`/merchants/public/storefront/${slug}`),
    apiPublicGet<PublicProduct[]>(`/products/public/storefront/${slug}`),
  ]);

  return (
    <div>
      <section
        className="relative overflow-hidden px-6 py-16 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #1a0a2e, #0A0A0A, #1a0a2e)",
        }}
      >
        {storefront.isOpen && (
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Open now
          </span>
        )}
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Shop <span className="text-orange">{storefront.storeName}</span>
        </h1>
        {storefront.description && (
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            {storefront.description}
          </p>
        )}
        <a
          href="#products"
          className="mt-6 inline-block rounded-md bg-orange px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Shop now
        </a>
      </section>

      <div id="products" className="p-6">
        {products.length === 0 ? (
          <p className="text-sm text-grey-500">No products available yet.</p>
        ) : (
          <ProductGrid slug={slug} products={products} />
        )}
      </div>
    </div>
  );
}
