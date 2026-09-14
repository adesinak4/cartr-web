"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { DomainProvisioningTask } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function markDomainProvisioningDone(taskId: string): Promise<ActionState> {
  try {
    await apiMutate<DomainProvisioningTask>(`/admin/domain-provisioning/${taskId}/done`, "PATCH");
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to mark as done." };
  }
  revalidatePath("/admin/domain-provisioning");
  return { error: null };
}
