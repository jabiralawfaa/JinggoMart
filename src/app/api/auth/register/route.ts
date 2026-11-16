import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, hashPassword, signSessionToken } from "@/lib/auth";
import { validateRegister } from "@/lib/validators";
import { badRequest } from "@/lib/api";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body JSON tidak valid.");
  }

  const { data, errors } = validateRegister(body as Record<string, unknown>);
  if (!data) return badRequest("Periksa kembali isian.", errors);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing)
    return badRequest("Email sudah terdaftar.", {
      email: "Email sudah terdaftar. Silakan login.",
    });

  const password = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { email: data.email, nama: data.nama, password, role: data.role },
  });

  const token = await signSessionToken(user);
  const res = NextResponse.json(
    { user: { id: user.id, email: user.email, nama: user.nama, role: user.role } },
    { status: 201 }
  );
  return attachSessionCookie(res, token);
}
