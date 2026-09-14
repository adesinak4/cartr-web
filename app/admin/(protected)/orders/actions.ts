"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { AdminOrder } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function refundOrder(orderId: string): Promise<ActionState> {
  try {
    await apiMutate<AdminOrder>(`/admin/orders/${orderId}/refund`, "POST");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to refund order." };
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
