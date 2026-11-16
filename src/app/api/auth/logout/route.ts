import { NextResponse } from "next/server";
import { detachSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  return detachSessionCookie(res);
}
