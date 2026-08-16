/**
 * Pure — extracts a merchant slug from a `{slug}.{platformDomain}` subdomain.
 * Returns null for the platform's own bare domain, localhost, or a
 * multi-level subdomain (not a simple single-slug prefix). No backend call
 * needed for this case — the slug IS the subdomain.
 */
export function extractSubdomainSlug(host: string, platformDomain: string): string | null {
  const hostname = host.split(":")[0];
  const platform = platformDomain.split(":")[0];

  if (hostname === platform || hostname === "localhost") return null;
  if (!hostname.endsWith(`.${platform}`)) return null;

  const slug = hostname.slice(0, -(`.${platform}`.length));
  if (!slug || slug.includes(".")) return null;

  return slug;
}
