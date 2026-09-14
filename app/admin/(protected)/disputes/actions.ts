"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { Dispute } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function createDispute(orderId: string, reason: string): Promise<ActionState> {
  try {
    await apiMutate<Dispute>("/admin/disputes", "POST", { orderId, reason });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to log dispute." };
  }
  revalidatePath("/admin/disputes");
  return { error: null };
}

export async function resolveDispute(
  disputeId: string,
  resolutionNotes: string,
): Promise<ActionState> {
  try {
    await apiMutate<Dispute>(`/admin/disputes/${disputeId}/resolve`, "PATCH", { resolutionNotes });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to resolve dispute." };
  }
  revalidatePath("/admin/disputes");
  return { error: null };
}
