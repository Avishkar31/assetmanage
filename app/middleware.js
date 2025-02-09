import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  // Get the token from cookies
  const token = req.cookies.get("token")?.value || null;

  // Define public routes that do not require authentication
  const publicRoutes = [/^\/login$/, /^\/signup$/, /^\/public\/.*/];

  // Check if the route is public
  const pathname = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some((route) => route.test(pathname));

  if (isPublicRoute) {
    return NextResponse.next(); // Allow access to public routes
  }

  // Validate the token for protected routes
  if (token) {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token is valid, allow access
      req.nextUrl.pathname = pathname;
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      console.error("Invalid Token:", error.message);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // No token, redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}

// Configuration for protected routes
export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/stocks/:path*"] // Protect these routes
};
