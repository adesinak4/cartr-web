"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api-server";
import { ApiError } from "@/lib/api-client";
import { env } from "@/lib/env";

export interface SubscriptionActionState {
  error: string | null;
}

const initialState: SubscriptionActionState = { error: null };

export async function startCheckout(): Promise<SubscriptionActionState> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? env.NEXT_PUBLIC_APP_URL;
  const redirectUrl = `${origin}/dashboard/subscription/callback`;

  let paymentLink: string;
  try {
    const result = await apiMutate<{ paymentLink: string }>(
      "/subscriptions/checkout",
      "POST",
      { redirectUrl },
    );
    paymentLink = result.paymentLink;
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.message
          : "Unable to start checkout right now.",
    };
  }

  redirect(paymentLink);
}

export async function changePlan(planId: string): Promise<SubscriptionActionState> {
  try {
    await apiMutate("/subscriptions/plan", "PATCH", { planId });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to change plan.",
    };
  }

  revalidatePath("/dashboard/subscription");
  return initialState;
}
