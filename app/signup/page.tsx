import { SignupForm } from "./signup-form";
import { IconCheckCircle } from "@/components/icons";

const PERKS = [
  "14-day free trial, no card needed",
  "Store live in under 5 minutes",
  "Payments integrated from day one",
  "Human support whenever you need it",
];

export default function SignupPage() {
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
          Join merchants already selling online.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">
          Create your free store in minutes. No technical skills required.
        </p>
        <ul className="mt-10 space-y-4">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-3 text-sm">
              <IconCheckCircle className="h-4 w-4 shrink-0 text-orange" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-dark">Welcome to Cartr!</h2>
          <p className="mt-1 text-sm text-grey-500">Create your free store in minutes.</p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
