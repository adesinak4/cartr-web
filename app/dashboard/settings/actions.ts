"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { Merchant } from "@/lib/types";

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
