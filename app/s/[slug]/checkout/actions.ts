"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { apiPublicPost } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { CartItem } from "@/lib/cart";
import { env } from "@/lib/env";

export interface CheckoutState {
  error: string | null;
}

export async function submitCheckout(
  slug: string,
  items: CartItem[],
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? env.NEXT_PUBLIC_APP_URL;

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  const body = {
    customer: {
      name: [firstName, lastName].filter(Boolean).join(" "),
      email: String(formData.get("email") ?? "").trim() || undefined,
      phone: String(formData.get("phone") ?? "").trim(),
    },
    items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
    deliveryStreet: String(formData.get("deliveryStreet") ?? "").trim(),
    deliveryCity: String(formData.get("deliveryCity") ?? "").trim(),
    deliveryState: String(formData.get("deliveryState") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim() || undefined,
    redirectUrl: `${origin}/s/${slug}/checkout/confirmation`,
  };

  if (!body.customer.name || !body.customer.phone) {
    return { error: "Name and phone are required." };
  }
  if (!body.deliveryStreet || !body.deliveryCity || !body.deliveryState) {
    return { error: "Full delivery address is required." };
  }

  let paymentLink: string;
  try {
    const result = await apiPublicPost<{ paymentLink: string }>(
      `/orders/public/storefront/${slug}/checkout`,
      body,
    );
    paymentLink = result.paymentLink;
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Unable to start checkout right now.",
    };
  }

  redirect(paymentLink);
}
