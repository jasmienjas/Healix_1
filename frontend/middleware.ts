import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/signup/doctor" ||
    path === "/signup/patient" ||
    path === "/forgot-password" ||
    path === "/verify-email" ||
    path === "/check-status"

  // Check if user is authenticated by looking for the token in cookies
  const token = request.cookies.get("healix_auth_token")?.value || ""

  // If the path requires authentication and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access a public path, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify the paths that should be processed by the middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/calendar/:path*",
    "/messages/:path*",
    "/help/:path*",
    "/login",
    "/signup",
    "/signup/doctor",
    "/signup/patient",
    "/forgot-password",
    "/verify-email",
    "/check-status",
  ],
}

