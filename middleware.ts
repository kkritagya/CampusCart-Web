import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define public and protected paths
  const isPublicRoute = pathname === "/login" || pathname === "/register";
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname === "/user" ||
    pathname.startsWith("/user/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/");

  // If user has a token and tries to access login/register, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user does not have a token and tries to access a protected route, redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Optionally preserve the attempted destination
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/user/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
};
