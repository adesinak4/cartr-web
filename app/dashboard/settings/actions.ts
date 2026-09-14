"use server";

import { revalidatePath } from "next/cache";
import { apiGet, apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { Merchant, PaymentAccount } from "@/lib/types";

export interface SettingsFormState {
  error: string | null;
  success: boolean;
}

export async function updateStoreInfo(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const body = {
    storeName: String(formData.get("storeName") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    logoUrl: String(formData.get("logoUrl") ?? "").trim() || undefined,
    address: String(formData.get("address") ?? "").trim() || undefined,
    isOpen: formData.get("isOpen") === "on",
  };

  if (!body.storeName) {
    return { error: "Store name is required.", success: false };
  }

  try {
    await apiMutate<Merchant>("/merchants/me", "PATCH", body);
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to update store settings.",
      success: false,
    };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function selectTheme(themeId: string): Promise<SettingsFormState> {
  try {
    await apiMutate<Merchant>("/merchants/me", "PATCH", { themeId });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to select theme.",
      success: false,
    };
  }

  revalidatePath("/dashboard/settings");
  return { error: null, success: true };
}

export async function setCustomDomain(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const customDomain = String(formData.get("customDomain") ?? "").trim();

  if (!customDomain) {
    return { error: "Enter a domain.", success: false };
  }

  try {
    await apiMutate<Merchant>("/merchants/me", "PATCH", { customDomain });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to set custom domain.",
      success: false,
    };
  }

  revalidatePath("/dashboard/settings");
  return { error: null, success: true };
}

export interface ResolveAccountState {
  accountName: string | null;
  error: string | null;
}

export async function resolveAccountName(
  bankCode: string,
  accountNumber: string,
): Promise<ResolveAccountState> {
  if (!bankCode || !accountNumber) {
    return { accountName: null, error: null };
  }

  try {
    const result = await apiGet<{ accountName: string }>(
      `/payment-accounts/resolve?bankCode=${encodeURIComponent(bankCode)}&accountNumber=${encodeURIComponent(accountNumber)}`,
    );
    return { accountName: result.accountName, error: null };
  } catch (err) {
    return {
      accountName: null,
      error: err instanceof ApiError ? err.message : "Could not verify this account.",
    };
  }
}

export async function createPaymentAccount(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const bankCode = String(formData.get("bankCode") ?? "").trim();
  const bankName = String(formData.get("bankName") ?? "").trim();
  const accountNumber = String(formData.get("accountNumber") ?? "").trim();
  const accountName = String(formData.get("accountName") ?? "").trim();
  const businessEmail = String(formData.get("businessEmail") ?? "").trim();
  const businessMobile = String(formData.get("businessMobile") ?? "").trim();

  if (!bankCode || !accountNumber || !accountName || !businessEmail || !businessMobile) {
    return { error: "All fields are required.", success: false };
  }

  try {
    await apiMutate<PaymentAccount>("/payment-accounts", "POST", {
      bankCode,
      bankName,
      accountNumber,
      accountName,
      businessEmail,
      businessMobile,
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to set up payouts.",
      success: false,
    };
  }

  revalidatePath("/dashboard/settings");
  return { error: null, success: true };
}

export async function verifyCustomDomain(): Promise<SettingsFormState> {
  try {
    await apiMutate<Merchant>("/merchants/me/custom-domain/verify", "POST");
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Verification check failed.",
      success: false,
    };
  }

  revalidatePath("/dashboard/settings");
  return { error: null, success: true };
}
