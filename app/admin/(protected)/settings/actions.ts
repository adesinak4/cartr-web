"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { PlatformSetting } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function upsertSetting(
  key: string,
  value: string,
  description?: string,
): Promise<ActionState> {
  if (!key.trim()) return { error: "Key is required." };
  try {
    await apiMutate<PlatformSetting>(`/admin/settings/${encodeURIComponent(key.trim())}`, "PUT", {
      value,
      description,
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to save setting." };
  }
  revalidatePath("/admin/settings");
  return { error: null };
}

export async function deleteSetting(key: string): Promise<ActionState> {
  try {
    await apiMutate<{ deleted: boolean }>(`/admin/settings/${encodeURIComponent(key)}`, "DELETE");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to delete setting." };
  }
  revalidatePath("/admin/settings");
  return { error: null };
}
