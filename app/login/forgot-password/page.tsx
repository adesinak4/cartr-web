import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";
import { IconArrowLeft } from "@/components/icons";

export default function ForgotPasswordPage() {
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
          Don&apos;t worry, it happens to everyone.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">
          Tell us your email and we&apos;ll help you get back into your store.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1 text-sm text-grey-500 hover:text-dark"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
