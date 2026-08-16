import { notFound } from "next/navigation";
import Link from "next/link";
import { apiPublicGet } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { PublicProduct } from "@/lib/types";
import { ProductDetail } from "./product-detail";
import { AddToCartButton } from "../../add-to-cart-button";
import { IconChevronRight, IconShield, IconTruck, IconUndo } from "@/components/icons";

async function getProduct(slug: string, productId: string): Promise<PublicProduct> {
  try {
    return await apiPublicGet<PublicProduct>(
      `/products/public/storefront/${slug}/${productId}`,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function ProductPage(
  props: PageProps<"/s/[slug]/product/[productId]">,
) {
  const { slug, productId } = await props.params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug, productId),
    apiPublicGet<PublicProduct[]>(`/products/public/storefront/${slug}`).catch(() => []),
  ]);

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-grey-400">
        <Link href={`/s/${slug}`} className="hover:text-dark">
          Store
        </Link>
        {product.category && (
          <>
            <IconChevronRight className="h-3 w-3" />
            <span>{product.category}</span>
          </>
        )}
        <IconChevronRight className="h-3 w-3" />
        <span className="text-dark">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg bg-grey-100">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-4xl">🛍️</span>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">
              {product.category}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-semibold text-dark">{product.name}</h1>
          <p className="mt-2 text-xl text-dark">{product.price}</p>
          {product.originalPrice && (
            <p className="mt-1 text-sm text-grey-400 line-through">Was {product.originalPrice}</p>
          )}

          <div className="my-4 border-t border-grey-200" />

          {product.description && (
            <p className="text-sm text-grey-500">{product.description}</p>
          )}

          <div className="my-4 border-t border-grey-200" />

          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            ✓ {product.stock} in stock
          </p>

          <div className="my-4 border-t border-grey-200" />

          <ProductDetail slug={slug} product={product} />

          <div className="mt-6 flex flex-col gap-2 text-xs text-grey-500">
            <div className="flex items-center gap-2">
              <IconTruck className="h-4 w-4 text-blue" /> Delivered within 2–5 business days
            </div>
            <div className="flex items-center gap-2">
              <IconShield className="h-4 w-4 text-success" /> Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <IconUndo className="h-4 w-4 text-orange" /> 7-day return policy
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-lg font-semibold text-dark">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <div key={p.id} className="rounded-lg border border-grey-200 p-3">
                <Link href={`/s/${slug}/product/${p.id}`}>
                  <div className="mb-2 flex aspect-square items-center justify-center rounded-md bg-grey-100">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🛍️</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-dark">{p.name}</p>
                  <p className="text-sm text-grey-500">{p.price}</p>
                </Link>
                <div className="mt-2">
                  <AddToCartButton slug={slug} product={{ id: p.id, name: p.name, price: p.price }} compact />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
