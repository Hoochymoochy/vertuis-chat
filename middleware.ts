import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "pt"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth callback to bypass locale checks
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Visiting root "/" → redirect to "/en"
  if (pathname === "/") {
    const acceptLang = request.headers.get("accept-language")?.split(",")[0] || "en";
    const defaultLocale = locales.includes(acceptLang) ? acceptLang : "en";
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }


  // Pull the first segment (the locale)
  const pathLocale = pathname.split("/")[1];

  // Locale not supported? Show 404
  if (!locales.includes(pathLocale)) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|icons|images|.*\\.).*)",
  ],
};
