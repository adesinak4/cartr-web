import Link from "next/link";
import { apiPublicGet } from "@/lib/api-public";
import { Plan, Theme } from "@/lib/types";
import { OnboardingWizard } from "./onboarding-wizard";

// Live plan/theme data for a signup flow — never statically baked into the
// build. Also sidesteps prerendering ever needing to reach cartr-api.
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const [plans, themes] = await Promise.all([
    apiPublicGet<Plan[]>("/plans"),
    apiPublicGet<Theme[]>("/themes"),
  ]);

  return (
    <div className="min-h-screen bg-grey-100">
      <header className="border-b border-grey-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-dark">
            Cartr
          </Link>
          <p className="text-sm text-grey-500">
            Already have a store?{" "}
            <Link href="/login" className="font-medium text-blue hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </header>

      <OnboardingWizard plans={plans} themes={themes} />
    </div>
  );
}
