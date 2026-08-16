"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@/components/icons";

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          phone: form.get("phone"),
          storeName: form.get("storeName"),
          password: form.get("password"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Could not create your store");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your store");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm text-grey-500">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm text-grey-500">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-grey-500">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm text-grey-500">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="storeName" className="mb-1 block text-sm text-grey-500">
          Store name
        </label>
        <input
          id="storeName"
          name="storeName"
          required
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-grey-500">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            className="w-full rounded-md border border-grey-200 px-3 py-2 pr-9 text-sm outline-none focus:border-blue"
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
        className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark disabled:opacity-60"
      >
        {loading ? "Creating your store…" : "Create my store"}
      </button>

      <p className="text-center text-xs text-grey-400">
        By continuing you agree to Cartr&apos;s Terms of Service and Privacy Policy.
      </p>

      <p className="mt-2 border-t border-grey-200 pt-4 text-center text-sm text-grey-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
