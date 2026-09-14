import { NextRequest, NextResponse } from "next/server";
import { apiPublicPost } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { env } from "@/lib/env";

interface CheckoutResult {
  paymentLink: string;
  draftId: string;
}

const REQUIRED_STRING_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "storeName",
  "domain",
  "planId",
] as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof (body as Record<string, unknown>)[field] !== "string") {
      return NextResponse.json({ message: `${field} is required` }, { status: 400 });
    }
  }

  const hasPassword = typeof body.password === "string" && body.password.length > 0;
  const hasGoogleToken = typeof body.googleIdToken === "string" && body.googleIdToken.length > 0;
  if (hasPassword === hasGoogleToken) {
    return NextResponse.json(
      { message: "Provide exactly one of password or googleIdToken" },
      { status: 400 },
    );
  }

  if (![3, 6, 12].includes(body.periodMonths)) {
    return NextResponse.json(
      { message: "periodMonths must be 3, 6, or 12" },
      { status: 400 },
    );
  }

  try {
    const data = await apiPublicPost<CheckoutResult>("/onboarding/checkout", {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      password: hasPassword ? body.password : undefined,
      googleIdToken: hasGoogleToken ? body.googleIdToken : undefined,
      storeName: body.storeName,
      domain: body.domain,
      planId: body.planId,
      periodMonths: body.periodMonths,
      themeId: typeof body.themeId === "string" ? body.themeId : undefined,
      // Flutterwave sends the browser back here with its own tx_ref/status
      // query params appended — tx_ref is the draft's own id, so the
      // confirmation page never needs draftId baked into this URL itself.
      redirectUrl: `${env.NEXT_PUBLIC_APP_URL}/signup/confirmation`,
    });

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
