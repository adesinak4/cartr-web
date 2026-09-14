import { NextRequest, NextResponse } from "next/server";
import { apiPublicGet } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { DomainCheckResult } from "@/lib/types";

export async function GET(req: NextRequest) {
  const businessName = req.nextUrl.searchParams.get("businessName");

  if (!businessName) {
    return NextResponse.json({ message: "businessName is required" }, { status: 400 });
  }

  try {
    const data = await apiPublicGet<DomainCheckResult[]>(
      `/domains/public/suggest?businessName=${encodeURIComponent(businessName)}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
