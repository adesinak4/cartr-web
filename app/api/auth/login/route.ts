import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api-client";
import { setAuthCookies } from "@/lib/auth-cookies";

interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    tenantId: string | null;
    role: string;
    name: string;
    email: string;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const data = await apiRequest<LoginData>("/auth/login", {
      method: "POST",
      body: { email: body.email, password: body.password },
    });

    const res = NextResponse.json({ user: data.user });
    setAuthCookies(res, data.accessToken, data.refreshToken);
    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message, code: err.code },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "Unable to reach the server" },
      { status: 502 },
    );
  }
}
