"use client";

import { useEffect, useState } from "react";
import { Plan, Theme, BillingPeriodMonths } from "@/lib/types";
import { Stepper } from "@/components/stepper";
import { EMPTY_WIZARD_DATA, WIZARD_STEPS, WIZARD_STORAGE_KEY, WizardData } from "./wizard-types";
import { StepPlan } from "./steps/step-plan";
import { StepPersonal, PersonalData } from "./steps/step-personal";
import { StepBusiness } from "./steps/step-business";
import { StepTemplate } from "./steps/step-template";
import { StepReview } from "./steps/step-review";

export function OnboardingWizard({ plans, themes }: { plans: Plan[]; themes: Theme[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<WizardData>(EMPTY_WIZARD_DATA);
  const [password, setPassword] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage once on mount — survives back/forward and
  // accidental reloads within the same tab; password is never persisted, so
  // a reload past the personal-details step drops the user back onto that
  // step to re-enter it (everything else stays filled in).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WIZARD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: WizardData; step: number };
        const restoredData = { ...EMPTY_WIZARD_DATA, ...parsed.data };
        const maxReachableStep = restoredData.planId ? (parsed.step ?? 0) : 0;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage read, avoids SSR/client hydration mismatch (see cart/page.tsx precedent)
        setData(restoredData);
        setStepIndex(Math.min(maxReachableStep, 1));
      }
    } catch {
      // Corrupt/unavailable storage — start fresh rather than crash the page.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({ data, step: stepIndex }));
    } catch {
      // Storage unavailable (private mode, quota) — wizard still works in-memory.
    }
  }, [data, stepIndex, hydrated]);

  const selectedPlan = plans.find((p) => p.id === data.planId) ?? null;

  function goTo(index: number) {
    setStepIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!hydrated) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 sm:mb-10">
        <Stepper
          steps={WIZARD_STEPS}
          currentIndex={stepIndex}
          onStepClick={(i) => goTo(i)}
        />
      </div>

      <div className="rounded-lg border border-grey-200 bg-white p-5 shadow-card sm:p-8">
        {stepIndex === 0 && (
          <StepPlan
            plans={plans}
            planId={data.planId}
            periodMonths={data.periodMonths}
            onContinue={(planId, periodMonths: BillingPeriodMonths) => {
              setData((d) => ({ ...d, planId, periodMonths }));
              goTo(1);
            }}
          />
        )}

        {stepIndex === 1 && (
          <StepPersonal
            value={{
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              password,
              googleIdToken,
            }}
            onBack={() => goTo(0)}
            onContinue={(personal: PersonalData) => {
              setData((d) => ({
                ...d,
                firstName: personal.firstName,
                lastName: personal.lastName,
                email: personal.email,
                phone: personal.phone,
              }));
              setPassword(personal.password);
              setGoogleIdToken(personal.googleIdToken);
              goTo(2);
            }}
          />
        )}

        {stepIndex === 2 && (
          <StepBusiness
            storeName={data.storeName}
            domain={data.domain}
            onBack={() => goTo(1)}
            onContinue={(storeName, domain) => {
              setData((d) => ({ ...d, storeName, domain }));
              goTo(3);
            }}
          />
        )}

        {stepIndex === 3 && (
          <StepTemplate
            themes={themes}
            themeId={data.themeId}
            planFeatures={selectedPlan?.features ?? []}
            onBack={() => goTo(2)}
            onContinue={(themeId) => {
              setData((d) => ({ ...d, themeId }));
              goTo(4);
            }}
          />
        )}

        {stepIndex === 4 && selectedPlan && (
          <StepReview
            data={data}
            password={password}
            googleIdToken={googleIdToken}
            plan={selectedPlan}
            theme={themes.find((t) => t.id === data.themeId) ?? null}
            onBack={() => goTo(3)}
          />
        )}
      </div>
    </div>
  );
}
