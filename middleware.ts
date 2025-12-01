import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "pt"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Visiting root "/" → redirect to "/en"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  // Pull the first segment (the locale)
  const pathLocale = pathname.split("/")[1];

  // Locale not supported? Show 404
  if (!locales.includes(pathLocale)) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|icons|images|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ]
};