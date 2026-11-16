import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateProduct } from "@/lib/validators";
import { badRequest, forbidden, notFound, unauthorized } from "@/lib/api";
import { toProductDTO } from "@/lib/products";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role === "BUYER") return forbidden();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound("Produk tidak ditemukan.");
  if (user.role === "SELLER" && product.sellerId !== user.id)
    return forbidden("Anda hanya bisa mengubah produk milik sendiri.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body JSON tidak valid.");
  }

  const { data, errors } = validateProduct(body as Record<string, unknown>);
  if (!data) return badRequest("Periksa kembali isian form.", errors);

  let sellerId = product.sellerId;
  if (user.role === "ADMIN" && data.sellerId) {
    const seller = await prisma.user.findUnique({ where: { id: data.sellerId } });
    if (!seller)
      return badRequest("Penjual tidak ditemukan.", {
        sellerId: "Penjual tidak ditemukan.",
      });
    sellerId = data.sellerId;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      nama: data.nama,
      kategori: data.kategori,
      harga: data.harga,
      stok: data.stok,
      deskripsi: data.deskripsi,
      imageUrl: data.imageUrl,
      unggulan: data.unggulan,
      sellerId,
    },
    include: { seller: { select: { nama: true } } },
  });

  return NextResponse.json({ product: toProductDTO(updated) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role === "BUYER") return forbidden();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound("Produk tidak ditemukan.");
  if (user.role === "SELLER" && product.sellerId !== user.id)
    return forbidden("Anda hanya bisa menghapus produk milik sendiri.");

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
