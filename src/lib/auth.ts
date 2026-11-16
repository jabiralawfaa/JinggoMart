import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";
import type { Role, SessionUser } from "@/types";

export const SESSION_COOKIE = "jinggomart_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secretKey(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "jinggomart-dev-secret-change-me"
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(user: {
  id: string;
  email: string;
  nama: string;
  role: Role;
}): Promise<string> {
  return new SignJWT({ email: user.email, nama: user.nama, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: (payload.email as string) ?? "",
      nama: (payload.nama as string) ?? "",
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

// Menempelkan cookie session ke response (dipakai di Route Handler).
export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export function detachSessionCookie(res: NextResponse): NextResponse {
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
