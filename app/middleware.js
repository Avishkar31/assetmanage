import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token");

  // Define public routes that do not require authentication
  const publicRoutes = ["/login", "/signup"];

  // Check if the route is public
  const pathname = req.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Validate the token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token is valid, allow access to the route
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

export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/stocks/:path*"] // Protect these routes
};
