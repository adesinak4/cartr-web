import Link from "next/link";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { getSessionRole } from "@/lib/session";
import {
  IconBox,
  IconChartBar,
  IconMoney,
  IconGlobe,
  IconReceipt,
  IconCard,
  IconFlag,
  IconUsers,
  IconSliders,
  IconClock,
} from "@/components/icons";

const NAV_LINKS = [
  { href: "/admin/overview", label: "Overview", icon: IconChartBar },
  { href: "/admin/merchants", label: "Merchants", icon: IconBox },
  { href: "/admin/plans", label: "Plans & fees", icon: IconMoney },
  { href: "/admin/domain-provisioning", label: "Domain queue", icon: IconGlobe },
  { href: "/admin/orders", label: "Orders", icon: IconReceipt },
  { href: "/admin/transactions", label: "Transactions", icon: IconCard },
  { href: "/admin/disputes", label: "Disputes", icon: IconFlag },
  // Admin-only — hidden entirely from a 'support' viewer, not just disabled.
  { href: "/admin/users", label: "Admin users", icon: IconUsers, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: IconSliders, adminOnly: true },
  { href: "/admin/audit-log", label: "Audit log", icon: IconClock },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getSessionRole();
  const links = NAV_LINKS.filter((link) => !link.adminOnly || role === "admin");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col justify-between overflow-y-auto bg-blue p-4">
        <div>
          <div className="mb-6 flex items-center gap-2 px-1">
            <span className="text-lg font-semibold text-white">Cartr</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
              {role === "support" ? "SUPPORT" : "ADMIN"}
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <link.icon className="h-4 w-4 text-white/70" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-white/15 pt-4">
          <p className="mb-2 px-1 text-xs text-white/60">
            {role === "support" ? "Support" : "Platform Admin"}
          </p>
          <LogoutButton
            redirectTo="/admin/login"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-60"
          />
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto bg-grey-100">{children}</main>
    </div>
  );
}
