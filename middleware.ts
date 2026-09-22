import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  isValidAdminSecret,
  isValidAdminSession,
} from "@/lib/admin/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isLogoutApi = pathname === "/api/admin/logout";

  if (isAdminPage || isAdminApi) {
    if (isLoginPage || isLoginApi || isLogoutApi) {
      return NextResponse.next();
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value;
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const sessionOk = await isValidAdminSession(cookieToken, adminSecret);
    const bearerOk =
      bearer !== null &&
      (isValidAdminSecret(bearer, adminSecret) ||
        (await isValidAdminSession(bearer, adminSecret)));

    if (!sessionOk && !bearerOk) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (request.method === "POST" && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        if (new URL(origin).host !== host) {
          return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
