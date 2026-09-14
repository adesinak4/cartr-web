"use client";

import { FormEvent, useState } from "react";
import { IconEye, IconEyeOff, IconCheckCircle } from "@/components/icons";
import {
  GoogleSignInButton,
  GoogleProfile,
  GOOGLE_SIGNIN_ENABLED,
} from "@/components/google-sign-in-button";

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Empty when googleIdToken is set — exactly one auth method reaches the backend. */
  password: string;
  googleIdToken?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-() ]{7,20}$/;

export function StepPersonal({
  value,
  onBack,
  onContinue,
}: {
  value: PersonalData;
  onBack: () => void;
  onContinue: (data: PersonalData) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleIdToken, setGoogleIdToken] = useState(value.googleIdToken);
  const [firstName, setFirstName] = useState(value.firstName);
  const [lastName, setLastName] = useState(value.lastName);
  const [email, setEmail] = useState(value.email);

  function onGoogleSuccess(profile: GoogleProfile) {
    setGoogleIdToken(profile.idToken);
    setFirstName(profile.firstName || firstName);
    setLastName(profile.lastName || lastName);
    setEmail(profile.email);
    setError(null);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    const password = googleIdToken ? "" : String(form.get("password") ?? "");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setError("Enter a valid phone number.");
      return;
    }
    if (!googleIdToken && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    onContinue({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone,
      password,
      googleIdToken,
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark">Your details</h2>
        <p className="mt-1 text-sm text-grey-500">
          This is who we&apos;ll contact — and how you&apos;ll log in.
        </p>
      </div>

      {!googleIdToken && GOOGLE_SIGNIN_ENABLED && (
        <>
          <GoogleSignInButton onSuccess={onGoogleSuccess} />
          <div className="flex items-center gap-3 text-xs text-grey-400">
            <div className="h-px flex-1 bg-grey-200" />
            or fill in manually
            <div className="h-px flex-1 bg-grey-200" />
          </div>
        </>
      )}

      {googleIdToken && (
        <div className="flex items-center gap-2 rounded-md bg-success-light px-3 py-2 text-sm text-success">
          <IconCheckCircle className="h-4 w-4 shrink-0" />
          Signed in with Google as {email}
          <button
            type="button"
            onClick={() => setGoogleIdToken(undefined)}
            className="ml-auto text-xs font-medium underline"
          >
            Use a different method
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm text-grey-500">
            First name
          </label>
          <input
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm text-grey-500">
            Last name
          </label>
          <input
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          type="email"
          required
          disabled={!!googleIdToken}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue disabled:bg-grey-100 disabled:text-grey-500"
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
          required
          defaultValue={value.phone}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>

      {!googleIdToken && (
        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-grey-500">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required={!googleIdToken}
              minLength={8}
              defaultValue={value.password}
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
          <p className="mt-1 text-xs text-grey-400">At least 8 characters.</p>
        </div>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-grey-200 px-4 py-2.5 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
