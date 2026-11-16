import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { SessionUser } from "@/types";

// Membaca sesi pengguna dari cookie httpOnly (server-side only).
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
