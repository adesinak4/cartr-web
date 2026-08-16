import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { Merchant, SubscriptionSummary } from "@/lib/types";
import { LogoutButton } from "./logout-button";
import {
  IconBox,
  IconCog,
  IconCrown,
  IconHeadset,
  IconHome,
  IconReceipt,
} from "@/components/icons";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/dashboard/products", label: "Products", icon: IconBox },
  { href: "/dashboard/orders", label: "Orders", icon: IconReceipt },
  { href: "/dashboard/settings", label: "Store settings", icon: IconCog },
  { href: "/dashboard/subscription", label: "Subscription", icon: IconCrown },
  { href: "/dashboard/support", label: "Support", icon: IconHeadset },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [merchant, subscription] = await Promise.all([
    apiGet<Merchant>("/merchants/me"),
    apiGet<SubscriptionSummary>("/subscriptions/me").catch(() => null),
  ]);

  const initials = merchant.storeName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col justify-between border-r border-grey-200 p-4">
        <div>
          <div className="mb-6 flex items-center justify-between px-1">
            <span className="text-lg font-semibold text-blue">Cartr</span>
            <a
              href={`/s/${merchant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-grey-500 hover:text-blue"
            >
              View store →
            </a>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-dark transition hover:bg-grey-100"
              >
                <link.icon className="h-4 w-4 text-grey-400" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-grey-200 pt-4">
          <div className="mb-2 flex items-center gap-2.5 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-light text-xs font-semibold text-blue">
              {initials || "?"}
            </span>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-dark">{merchant.storeName}</p>
              <p className="truncate text-xs capitalize text-grey-400">
                {subscription?.subscriptionStatus === "trialing"
                  ? "Trial plan"
                  : (subscription?.subscriptionStatus ?? "").replace("_", " ") || "—"}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 bg-grey-100">{children}</main>
    </div>
  );
}
