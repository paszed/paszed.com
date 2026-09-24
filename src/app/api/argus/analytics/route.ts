import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { readAnalyticsReport } from "@/analytics/report/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_WINDOW_MS = 24 * 60 * 60 * 1000;

function authorized(request: Request): boolean {
  const token = process.env.ARGUS_ANALYTICS_TOKEN;
  const header = request.headers.get("authorization");
  if (!token || !header?.startsWith("Bearer ")) return false;

  const supplied = Buffer.from(header.slice(7), "utf8");
  const expected = Buffer.from(token, "utf8");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const fromValue = url.searchParams.get("from");
  const toValue = url.searchParams.get("to");
  if (!fromValue || !toValue) {
    return NextResponse.json({ error: "from_and_to_required" }, { status: 400 });
  }

  const from = new Date(fromValue);
  const to = new Date(toValue);
  const duration = to.getTime() - from.getTime();
  if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_WINDOW_MS || to.getTime() > Date.now()) {
    return NextResponse.json({ error: "invalid_time_window" }, { status: 400 });
  }

  try {
    const report = await readAnalyticsReport(from, to);
    return NextResponse.json(report, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[argus:analytics]", error);
    return NextResponse.json({ error: "report_unavailable" }, { status: 500 });
  }
}
