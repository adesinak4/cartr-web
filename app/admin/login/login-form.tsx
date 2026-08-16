"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconEye, IconEyeOff, IconLock, IconMail, IconShield } from "@/components/icons";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived directly from the URL on every render, not a useState
  // initializer — proxy.ts's redirect back here after a non-admin login
  // doesn't necessarily remount this component, so a one-time initial
  // value would miss it.
  const redirectError =
    searchParams.get("error") === "not_admin"
      ? "That account isn't a platform admin."
      : null;
  const error = submitError ?? redirectError;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Login failed");
      }

      router.push("/admin/overview");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-grey-400 lg:text-grey-500">
          Admin email
        </label>
        <div className="relative">
          <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-grey-200 bg-white py-2 pl-9 pr-3 text-sm text-dark outline-none focus:border-blue"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-grey-400 lg:text-grey-500">
          Password
        </label>
        <div className="relative">
          <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-grey-200 bg-white py-2 pl-9 pr-9 text-sm text-dark outline-none focus:border-blue"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        <IconShield className="h-4 w-4" />
        {loading ? "Logging in…" : "Log in as admin"}
      </button>
    </form>
  );
}
