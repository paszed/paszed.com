import { NextRequest, NextResponse } from "next/server";

import { isLocale } from "@/i18n";
import { resolveLocale } from "@/i18n/resolve-locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) return NextResponse.next();

  const locale = resolveLocale(
    request.cookies.get("NEXT_LOCALE")?.value,
    request.headers.get("accept-language"),
  );

  if (locale === "en") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/about", "/contact", "/specs", "/projects", "/projects/:path*"],
};

