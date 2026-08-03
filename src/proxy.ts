import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/provider": "PROVIDER",
  "/dashboard/admin": "ADMIN",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) => pathname.startsWith(prefix));
  if (!matchedPrefix) return NextResponse.next();

  const token = request.cookies.get("gearup_token")?.value;
  const role = request.cookies.get("gearup_role")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = ROLE_PREFIXES[matchedPrefix];
  if (role !== requiredRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
