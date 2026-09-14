import { NextRequest, NextResponse } from "next/server";
import { apiPublicGet } from "@/lib/api-public";
import { ApiError } from "@/lib/api-client";
import { DomainCheckResult } from "@/lib/types";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ message: "domain is required" }, { status: 400 });
  }

  try {
    const data = await apiPublicGet<DomainCheckResult>(
      `/domains/public/check?domain=${encodeURIComponent(domain)}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
