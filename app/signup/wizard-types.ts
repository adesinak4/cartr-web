import { BillingPeriodMonths } from "@/lib/types";

/**
 * Everything except `password` — password is kept only in the wizard
 * component's own React state, never written to sessionStorage, so a
 * refreshed/abandoned tab never leaves a plaintext password sitting in
 * browser storage. Losing it on reload just means re-typing the password;
 * every other field survives.
 */
export interface WizardData {
  planId: string;
  periodMonths: BillingPeriodMonths | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  storeName: string;
  domain: string;
  themeId: string | null;
}

export const EMPTY_WIZARD_DATA: WizardData = {
  planId: "",
  periodMonths: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  storeName: "",
  domain: "",
  themeId: null,
};

export const WIZARD_STORAGE_KEY = "cartr_onboarding_wizard";

export const WIZARD_STEPS = [
  { label: "Plan" },
  { label: "You" },
  { label: "Business" },
  { label: "Template" },
  { label: "Review & pay" },
];
