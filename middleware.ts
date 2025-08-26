import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // adjust cookie name if different

  // Protect all /dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      // redirect to login if no token
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
