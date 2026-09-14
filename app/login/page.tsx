import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { IconBox, IconChartBar, IconTruck } from "@/components/icons";

const FEATURES = [
  { icon: <IconChartBar className="h-4 w-4" />, label: "Real-time sales analytics" },
  { icon: <IconBox className="h-4 w-4" />, label: "Full product & inventory control" },
  { icon: <IconTruck className="h-4 w-4" />, label: "Order management & tracking" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div
        className="hidden flex-col justify-center px-12 py-16 text-white lg:flex"
        style={{
          background: "linear-gradient(160deg, #0A0A0A 0%, #1B2FFF 100%)",
        }}
      >
        <span className="text-lg font-semibold">Cartr</span>
        <h1 className="mt-8 max-w-sm text-3xl font-semibold leading-tight">
          Manage your store from anywhere.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">
          Track sales, manage products, and fulfil orders — all from one dashboard.
        </p>
        <ul className="mt-10 space-y-4">
          {FEATURES.map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                {f.icon}
              </span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-dark">Welcome back</h2>
          <p className="mt-1 text-sm text-grey-500">Log in to your merchant dashboard.</p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 border-t border-grey-200 pt-6 text-center text-sm text-grey-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-blue hover:underline">
              Create your store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
