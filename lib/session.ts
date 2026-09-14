import "server-only";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./cookies";
import { AppRole } from "./types";

/**
 * Decodes (never verifies) the access token's role claim for UI purposes
 * only — which nav items/buttons to show. This is NOT a security boundary;
 * cartr-api re-checks the real, signed token on every request regardless,
 * so a wrong or tampered read here can at worst show/hide a UI element, it
 * can never grant access to anything.
 */
export async function getSessionRole(): Promise<AppRole | null> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const [, payloadB64] = token.split(".");
    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { role?: AppRole };
    return payload.role ?? null;
  } catch {
    return null;
  }
}
