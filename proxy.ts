import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { classifyTraffic } from "@/analytics/classification/crawler";
import { trackServer } from "@/analytics/core/server";

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  const userAgent = request.headers.get("user-agent") ?? "";
  const trafficClass = classifyTraffic(userAgent);

  if (trafficClass !== "human" && trafficClass !== "unknown") {
    event.waitUntil(
      trackServer({
        type: trafficClass === "crawler" ? "crawl_route" : "bot_request",
        path: pathname,
        context: {
          userAgent,
          trafficClass,
          referrer: request.headers.get("referer") ?? undefined,
          metadata: { method: request.method },
        },
      }),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\..*).*)"],
};
