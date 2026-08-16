import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/cookies";
import { getJwtExpiry, getJwtRole } from "@/lib/jwt";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import { apiRequest, ApiError } from "@/lib/api-client";
import { extractSubdomainSlug } from "@/lib/tenant-host";
import { env } from "@/lib/env";

const REFRESH_MARGIN_SECONDS = 60;

interface RefreshData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Three responsibilities in one place, dispatched by path:
 *  1. /dashboard/* — any authenticated user, with proactive silent refresh.
 *  2. /admin/* (except /admin/login) — same, but additionally requires
 *     role === 'admin'.
 *  3. Everything else — host-based tenant resolution for the storefront,
 *     rewriting a subdomain/custom-domain request to /s/{slug}{path}.
 *
 * Refreshing here (rather than reactively on a 401 during a Server
 * Component render) sidesteps a real Next.js constraint: Server Components
 * can read cookies but can't set them mid-render, so a 401-triggered
 * refresh mid-request would have nowhere to persist the new token.
 * Middleware runs before rendering and can set response cookies, so this is
 * the one place a refresh can both happen and stick.
 */
export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/dashboard")) {
    return authGuard(req, { requireAdmin: false });
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return authGuard(req, { requireAdmin: true });
  }

  // Already at the storefront's real internal path, or a page with its own
  // auth handling — no host resolution needed.
  if (pathname.startsWith("/s/") || pathname === "/login" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  return tenantHostRewrite(req);
}

async function authGuard(
  req: NextRequest,
  options: { requireAdmin: boolean },
): Promise<NextResponse> {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  const exp = accessToken ? getJwtExpiry(accessToken) : null;
  const isFreshEnough =
    exp !== null && exp * 1000 > Date.now() + REFRESH_MARGIN_SECONDS * 1000;

  if (isFreshEnough) {
    return checkRole(req, accessToken!, options, NextResponse.next());
  }

  if (!refreshToken) {
    return redirectToLogin(req, options.requireAdmin);
  }

  try {
    const data = await apiRequest<RefreshData>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    const res = NextResponse.next();
    setAuthCookies(res, data.accessToken, data.refreshToken);
    return checkRole(req, data.accessToken, options, res);
  } catch (err) {
    const res = redirectToLogin(req, options.requireAdmin);
    if (err instanceof ApiError) {
      clearAuthCookies(res);
    }
    // A network failure reaching cartr-api also fails closed here rather
    // than letting a possibly-expired token through silently.
    return res;
  }
}

function checkRole(
  req: NextRequest,
  accessToken: string,
  options: { requireAdmin: boolean },
  passThrough: NextResponse,
): NextResponse {
  if (!options.requireAdmin) return passThrough;

  const role = getJwtRole(accessToken);
  if (role === "admin") return passThrough;

  // Authenticated, but not an admin — a merchant owner hitting /admin
  // should see a clear "not for you" redirect, not a blank/broken page.
  const url = new URL("/admin/login", req.url);
  url.searchParams.set("error", "not_admin");
  return NextResponse.redirect(url);
}

function redirectToLogin(req: NextRequest, isAdmin: boolean) {
  const loginUrl = new URL(isAdmin ? "/admin/login" : "/login", req.url);
  loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

async function tenantHostRewrite(req: NextRequest): Promise<NextResponse> {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  // The platform's own bare domain / localhost — never a tenant, render normally.
  if (hostname === env.PLATFORM_DOMAIN.split(":")[0] || hostname === "localhost") {
    return NextResponse.next();
  }

  let slug = extractSubdomainSlug(host, env.PLATFORM_DOMAIN);

  if (!slug) {
    try {
      const result = await apiRequest<{ slug: string }>(
        `/merchants/public/resolve-domain?domain=${encodeURIComponent(hostname)}`,
      );
      slug = result.slug;
    } catch {
      // Unknown host — let it fall through to normal routing (404s naturally).
      return NextResponse.next();
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/s/${slug}${req.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
