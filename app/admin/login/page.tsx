import { Suspense } from "react";
import Link from "next/link";
import { AdminLoginForm } from "./login-form";
import { IconShield } from "@/components/icons";

export default function AdminLoginPage() {
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
          Cartr Admin Console
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">
          Platform operations, merchant management, and revenue oversight — all in one place.
        </p>
        <div className="mt-10 max-w-sm rounded-lg border border-white/15 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange">
            Restricted access
          </p>
          <p className="mt-1 text-sm text-white/70">
            This login is for Cartr platform administrators only. Merchants should use the{" "}
            <Link href="/login" className="text-white underline">
              merchant login
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-dark px-6 py-16 lg:bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-light text-blue">
            <IconShield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-white lg:text-dark">Admin login</h2>
          <p className="mt-1 text-sm text-grey-400 lg:text-grey-500">
            Restricted to platform administrators.
          </p>
          <div className="mt-6">
            <Suspense>
              <AdminLoginForm />
            </Suspense>
          </div>
          <Link
            href="/login"
            className="mt-6 block text-center text-sm text-grey-400 hover:underline lg:text-grey-500"
          >
            ← Back to merchant login
          </Link>
        </div>
      </div>
    </div>
  );
}
