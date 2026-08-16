import { apiRequest } from "./api-client";

// Public cartr-api endpoints — no access token, no cookies. Separate from
// lib/api-server.ts (which requires an authenticated session) so a
// storefront page can never accidentally end up gated behind a login check.

export async function apiPublicGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

export async function apiPublicPost<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body });
}
