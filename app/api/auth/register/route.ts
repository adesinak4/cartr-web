import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api-client";
import { setAuthCookies } from "@/lib/auth-cookies";

interface RegisterData {
  accessToken: string;
  refreshToken: string;
  user: { id: string; tenantId: string | null; role: string; name: string; email: string };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.firstName !== "string" ||
    typeof body.lastName !== "string" ||
    typeof body.email !== "string" ||
    typeof body.storeName !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const data = await apiRequest<RegisterData>("/merchants/public/register", {
      method: "POST",
      body: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: typeof body.phone === "string" ? body.phone : undefined,
        storeName: body.storeName,
        password: body.password,
      },
    });

    const res = NextResponse.json({ user: data.user });
    setAuthCookies(res, data.accessToken, data.refreshToken);
    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
