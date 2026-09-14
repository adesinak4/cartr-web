import { notFound } from "next/navigation";
import Link from "next/link";
import { apiPublicGet } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { PublicStorefront } from "@/lib/types";
import { CartLink } from "./cart-link";
import { WHATSAPP_LINK } from "@/lib/constants";
import { IconClock, IconStoreSlash, IconWhatsApp } from "@/components/icons";

async function getStorefront(slug: string): Promise<PublicStorefront | { unavailable: true }> {
  try {
    return await apiPublicGet<PublicStorefront>(`/merchants/public/storefront/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    if (err instanceof ApiError && err.status === 403) {
      return { unavailable: true };
    }
    throw err;
  }
}

function ClosedCard({
  icon,
  title,
  body,
  showHours,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  showHours: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grey-100 p-8">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-card-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-grey-100 text-grey-400">
          {icon}
        </div>
        <h1 className="text-lg font-semibold text-dark">{title}</h1>
        <p className="mt-2 text-sm text-grey-500">{body}</p>

        {showHours && (
          <div className="mt-6 flex flex-col gap-3 rounded-md border border-grey-200 p-4 text-left text-sm">
            <div className="flex items-center gap-2 text-grey-500">
              <IconClock className="h-4 w-4 shrink-0" />
              Monday – Saturday: 9am – 6pm
            </div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-success hover:underline"
            >
              <IconWhatsApp className="h-4 w-4 shrink-0" />
              WhatsApp us
            </a>
          </div>
        )}

        <p className="mt-6 text-xs text-grey-400">Powered by Cartr</p>
      </div>
    </div>
  );
}

export default async function StorefrontLayout({
  children,
  params,
}: LayoutProps<"/s/[slug]">) {
  const { slug } = await params;
  const storefront = await getStorefront(slug);

  if ("unavailable" in storefront) {
    return (
      <ClosedCard
        icon={<IconStoreSlash className="h-7 w-7" />}
        title="Store unavailable"
        body="This store isn't accepting orders right now."
        showHours={false}
      />
    );
  }

  if (!storefront.isOpen) {
    return (
      <ClosedCard
        icon={<IconStoreSlash className="h-7 w-7" />}
        title="Store is currently closed"
        body={`${storefront.storeName} isn't accepting orders right now. Check back soon — we'll be back open shortly.`}
        showHours
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-grey-200 bg-white px-6 py-4">
        <Link href={`/s/${slug}`} className="text-lg font-semibold text-dark">
          {storefront.storeName}
        </Link>
        <CartLink slug={slug} />
      </header>
      <main>{children}</main>
      <div className="border-t border-grey-200 bg-grey-100 px-6 py-4 text-center text-xs text-grey-500">
        Powered by <span className="font-medium text-blue">Cartr</span> ·{" "}
        <Link href="/" className="text-blue hover:underline">
          Create your own store →
        </Link>
      </div>
      <footer className="bg-dark px-6 py-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {storefront.storeName}. All rights reserved.
      </footer>
    </div>
  );
}
