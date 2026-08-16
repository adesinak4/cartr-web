import "server-only";
import { cookies } from "next/headers";
import { apiRequest, ApiError } from "./api-client";
import { ACCESS_TOKEN_COOKIE } from "./cookies";

/**
 * Used from Server Components/Server Actions under /dashboard. Assumes
 * proxy.ts has already proactively refreshed the access token before this
 * ever runs — this does NOT itself retry on 401, since
 * Server Components can't set cookies mid-render. A 401 here means
 * middleware's refresh genuinely failed moments ago, which is unusual
 * enough to surface as an error rather than silently retried.
 */
async function getAccessToken(): Promise<string> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
  }
  return token;
}

export async function apiGet<T>(path: string): Promise<T> {
  const accessToken = await getAccessToken();
  return apiRequest<T>(path, { accessToken });
}

export async function apiMutate<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const accessToken = await getAccessToken();
  return apiRequest<T>(path, { method, body, accessToken });
}
