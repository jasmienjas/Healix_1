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
    path === "/check-status" ||
    path === "/check-email" ||
    path === "/reset-password" ||
    path === "/upload"

  // Check for authentication token
  const token = request.cookies.get("healix_auth_token")?.value
  const userType = request.cookies.get("user_type")?.value

  // If already logged in and trying to access login/signup pages
  if (isPublicPath && token) {
    // Always redirect to main dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected routes without auth
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

// Update the config to match your routes
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/signup/doctor',
    '/signup/patient',
    '/dashboard',
    '/dashboard/doctor',
    '/verify-email',
    '/check-status',
    '/forgot-password',
    '/check-email',
    '/reset-password'
  ]
}

