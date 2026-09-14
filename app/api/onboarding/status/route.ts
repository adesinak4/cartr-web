import { NextRequest, NextResponse } from "next/server";
import { apiPublicGet } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { OnboardingStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  const draftId = req.nextUrl.searchParams.get("draftId");

  if (!draftId) {
    return NextResponse.json({ message: "draftId is required" }, { status: 400 });
  }

  try {
    const data = await apiPublicGet<OnboardingStatus>(`/onboarding/${draftId}/status`);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
