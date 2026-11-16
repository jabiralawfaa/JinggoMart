import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateProduct } from "@/lib/validators";
import { badRequest, forbidden, unauthorized } from "@/lib/api";
import { toProductDTO } from "@/lib/products";

// Daftar produk untuk dashboard: seller melihat miliknya, admin melihat semua.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role === "BUYER") return forbidden();

  const where = user.role === "SELLER" ? { sellerId: user.id } : {};
  const products = await prisma.product.findMany({
    where,
    include: { seller: { select: { nama: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ products: products.map(toProductDTO) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (user.role === "BUYER") return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body JSON tidak valid.");
  }

  const { data, errors } = validateProduct(body as Record<string, unknown>);
  if (!data) return badRequest("Periksa kembali isian form.", errors);

  let sellerId: string;
  if (user.role === "SELLER") {
    sellerId = user.id;
  } else {
    if (!data.sellerId)
      return badRequest("Pilih penjual (seller).", {
        sellerId: "Pilih penjual (seller).",
      });
    const seller = await prisma.user.findUnique({ where: { id: data.sellerId } });
    if (!seller)
      return badRequest("Penjual tidak ditemukan.", {
        sellerId: "Penjual tidak ditemukan.",
      });
    sellerId = data.sellerId;
  }

  const product = await prisma.product.create({
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

  return NextResponse.json({ product: toProductDTO(product) }, { status: 201 });
}
