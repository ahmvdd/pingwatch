import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register"];
const COOKIE_NAME = "pingwatch_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
      await jwtVerify(token, secret);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (!isPublic && !isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isValid && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
