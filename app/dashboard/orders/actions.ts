"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { Order, OrderStatus } from "@/lib/types";

export interface UpdateStatusState {
  error: string | null;
}

const initialState: UpdateStatusState = { error: null };

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<UpdateStatusState> {
  try {
    await apiMutate<Order>(`/orders/${orderId}/status`, "PATCH", { status });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update order status." };
  }

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return initialState;
}
