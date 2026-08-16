"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { IconCheckCircle, IconMail } from "@/components/icons";
import { WHATSAPP_LINK, SUPPORT_EMAIL } from "@/lib/constants";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // cartr-api has no self-serve password-reset endpoint yet, so this
    // intentionally does not claim to have emailed a reset link — that
    // would be dishonest UI. Instead it points the merchant to a real
    // human channel that can actually help.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-success">
          <IconCheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-dark">We&apos;ll help you get back in</h2>
        <p className="mt-2 text-sm text-grey-500">
          Automatic password reset isn&apos;t available yet. Message us on WhatsApp or email{" "}
          {SUPPORT_EMAIL} and we&apos;ll verify your account and reset it for you.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/login"
            className="rounded-md border border-grey-200 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-grey-100"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark">Reset your password</h2>
        <p className="mt-1 text-sm text-grey-500">
          Enter your email and we&apos;ll help you regain access.
        </p>
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-grey-500">
          Email
        </label>
        <div className="relative">
          <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input
            id="email"
            type="email"
            required
            className="w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        Continue
      </button>
    </form>
  );
}
