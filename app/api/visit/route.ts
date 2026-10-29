import { NextResponse, type NextRequest } from "next/server";
import { recordVisit, REF_PATTERN } from "@/lib/visits";

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora|whatsapp|linkedinbot|vercel-screenshot/i;

export async function POST(request: NextRequest) {
  let body: { ref?: unknown; path?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ref = typeof body.ref === "string" ? body.ref.trim().toLowerCase() : "";
  const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 100) : "/";
  if (!REF_PATTERN.test(ref)) return NextResponse.json({ ok: false }, { status: 400 });

  const userAgent = request.headers.get("user-agent");
  if (userAgent && BOTS.test(userAgent)) return NextResponse.json({ ok: true, stored: false });

  const city = request.headers.get("x-vercel-ip-city");
  try {
    const stored = await recordVisit({
      ref,
      path,
      country: request.headers.get("x-vercel-ip-country"),
      city: city ? decodeURIComponent(city) : null,
      userAgent: userAgent?.slice(0, 300) ?? null,
    });
    return NextResponse.json({ ok: true, stored });
  } catch (error) {
    console.error("visit not stored", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
