import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isRole } from "@/lib/validators";
import { badRequest, forbidden, notFound, unauthorized } from "@/lib/api";
import type { Role } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body JSON tidak valid.");
  }

  const role = (body as Record<string, unknown>).role;
  if (!isRole(role))
    return badRequest("Role tidak valid.", {
      role: "Role harus ADMIN, SELLER, atau BUYER.",
    });

  if (id === user.id && role !== "ADMIN")
    return badRequest("Anda tidak bisa menurunkan role akun sendiri.", {
      role: "Role akun sendiri tidak bisa diubah menjadi non-admin.",
    });

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return notFound("User tidak ditemukan.");

  const updated = await prisma.user.update({
    where: { id },
    data: { role: role as Role },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      nama: updated.nama,
      role: updated.role,
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden();
  if (id === user.id)
    return badRequest("Anda tidak bisa menghapus akun sendiri.");

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return notFound("User tidak ditemukan.");

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
