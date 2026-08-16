import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/lib/api-client";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/cookies";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken && refreshToken) {
    // Best-effort — revokes the refresh token family and denylists the
    // access token server-side. Cookies are cleared below regardless of
    // whether this succeeds, so the user is always logged out locally.
    await apiRequest("/auth/logout", {
      method: "POST",
      accessToken,
      body: { refreshToken },
    }).catch(() => {});
  }

  const res = NextResponse.json({ loggedOut: true });
  clearAuthCookies(res);
  return res;
}
