import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  attachSessionCookie,
  signSessionToken,
  verifyPassword,
} from "@/lib/auth";
import { validateLogin } from "@/lib/validators";
import { badRequest } from "@/lib/api";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body JSON tidak valid.");
  }

  const { data, errors } = validateLogin(body as Record<string, unknown>);
  if (!data) return badRequest("Periksa kembali isian.", errors);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await verifyPassword(data.password, user.password))) {
    return NextResponse.json(
      { error: "Email atau password salah.", errors: { password: "Email atau password salah." } },
      { status: 401 }
    );
  }

  const token = await signSessionToken(user);
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, nama: user.nama, role: user.role },
  });
  return attachSessionCookie(res, token);
}
