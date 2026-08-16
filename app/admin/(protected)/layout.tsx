import Link from "next/link";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { IconBox, IconChartBar } from "@/components/icons";

const NAV_LINKS = [
  { href: "/admin/overview", label: "Overview", icon: IconChartBar },
  { href: "/admin/merchants", label: "Merchants", icon: IconBox },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col justify-between bg-blue p-4">
        <div>
          <div className="mb-6 flex items-center gap-2 px-1">
            <span className="text-lg font-semibold text-white">Cartr</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
              ADMIN
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
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
          <p className="mb-2 px-1 text-xs text-white/60">Platform Admin</p>
          <LogoutButton
            redirectTo="/admin/login"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-60"
          />
        </div>
      </aside>
      <main className="flex-1 bg-grey-100">{children}</main>
    </div>
  );
}
