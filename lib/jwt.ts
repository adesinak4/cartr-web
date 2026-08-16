/**
 * Decodes JWT claims without verifying the signature — this is only ever
 * used as a hint for proactive refresh / coarse route gating, never as a
 * trust boundary. cartr-api verifies the real signature on every request
 * regardless. Uses atob() rather than Buffer so this works unmodified in
 * both the Edge and Node middleware runtimes.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getJwtExpiry(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp : null;
}

export function getJwtRole(token: string): string | null {
  const payload = decodeJwtPayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
}
