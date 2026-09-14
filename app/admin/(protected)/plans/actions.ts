"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { AdminPlanWithPrices, PlanPrice } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function updatePlanPrice(
  planId: string,
  periodMonths: number,
  totalPrice: string,
): Promise<ActionState> {
  try {
    await apiMutate<PlanPrice>(`/admin/plans/${planId}/prices`, "PATCH", {
      periodMonths,
      totalPrice,
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update price." };
  }
  revalidatePath("/admin/plans");
  return { error: null };
}

export async function updatePlanDetails(
  planId: string,
  updates: { name?: string; transactionFeePercent?: string; features?: string[] },
): Promise<ActionState> {
  try {
    await apiMutate<AdminPlanWithPrices>(`/admin/plans/${planId}`, "PATCH", updates);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update plan." };
  }
  revalidatePath("/admin/plans");
  return { error: null };
}

export async function createPlan(input: {
  name: string;
  monthlyPrice: string;
  transactionFeePercent: string;
  features: string[];
}): Promise<ActionState> {
  try {
    await apiMutate<AdminPlanWithPrices>("/admin/plans", "POST", input);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create plan." };
  }
  revalidatePath("/admin/plans");
  return { error: null };
}

export async function archivePlan(planId: string): Promise<ActionState> {
  try {
    await apiMutate<AdminPlanWithPrices>(`/admin/plans/${planId}/archive`, "PATCH");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to archive plan." };
  }
  revalidatePath("/admin/plans");
  return { error: null };
}

export async function unarchivePlan(planId: string): Promise<ActionState> {
  try {
    await apiMutate<AdminPlanWithPrices>(`/admin/plans/${planId}/unarchive`, "PATCH");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to unarchive plan." };
  }
  revalidatePath("/admin/plans");
  return { error: null };
}
