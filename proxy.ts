import { NextResponse, type NextRequest } from "next/server";
import { authorised } from "@/lib/auth";

// /admin is private: HTTP Basic auth against ADMIN_PASSWORD (any username).
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Admin is disabled: set ADMIN_PASSWORD.", { status: 503 });
  if (authorised(request.headers.get("authorization"), password)) return NextResponse.next();
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
