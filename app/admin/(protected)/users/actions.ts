"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { PlatformUser } from "@/lib/types";

export interface ActionState {
  error: string | null;
}

export async function createAdminUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "support",
): Promise<ActionState> {
  try {
    await apiMutate<PlatformUser>("/admin/users", "POST", { name, email, password, role });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create user." };
  }
  revalidatePath("/admin/users");
  return { error: null };
}

export async function setUserStatus(
  userId: string,
  status: "active" | "disabled",
): Promise<ActionState> {
  try {
    await apiMutate<PlatformUser>(`/admin/users/${userId}/status`, "PATCH", { status });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update user." };
  }
  revalidatePath("/admin/users");
  return { error: null };
}
