"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { AdminMerchant } from "@/lib/types";

export interface AdminActionState {
  error: string | null;
}

const initialState: AdminActionState = { error: null };

export async function suspendMerchant(merchantId: string): Promise<AdminActionState> {
  try {
    await apiMutate<AdminMerchant>(`/admin/merchants/${merchantId}/suspend`, "PATCH");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to suspend merchant." };
  }
  revalidatePath("/admin/merchants");
  revalidatePath(`/admin/merchants/${merchantId}`);
  return initialState;
}

export async function reactivateMerchant(merchantId: string): Promise<AdminActionState> {
  try {
    await apiMutate<AdminMerchant>(`/admin/merchants/${merchantId}/reactivate`, "PATCH");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to reactivate merchant." };
  }
  revalidatePath("/admin/merchants");
  revalidatePath(`/admin/merchants/${merchantId}`);
  return initialState;
}
