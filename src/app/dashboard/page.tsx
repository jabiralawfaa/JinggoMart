import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { toProductDTO } from "@/lib/products";
import DashboardClient from "@/components/DashboardClient";
import type { Stats, UserDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "BUYER") redirect("/");

  const isAdmin = user.role === "ADMIN";

  const products = await prisma.product.findMany({
    where: isAdmin ? {} : { sellerId: user.id },
    include: { seller: { select: { nama: true } } },
    orderBy: { updatedAt: "desc" },
  });

  let sellers: { id: string; nama: string; email: string }[] = [];
  let users: UserDTO[] = [];

  if (isAdmin) {
    sellers = await prisma.user.findMany({
      where: { role: "SELLER" },
      select: { id: true, nama: true, email: true },
      orderBy: { nama: "asc" },
    });

    const userRows = await prisma.user.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "asc" },
    });
    users = userRows.map((u) => ({
      id: u.id,
      email: u.email,
      nama: u.nama,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      _count: { products: u._count.products },
    }));
  }

  const stats: Stats = {
    totalProduk: products.length,
    totalStok: products.reduce((s, p) => s + p.stok, 0),
    totalKategori: new Set(products.map((p) => p.kategori)).size,
    totalUnggulan: products.filter((p) => p.unggulan).length,
    totalSeller: isAdmin ? users.filter((u) => u.role === "SELLER").length : 0,
    totalPembeli: isAdmin ? users.filter((u) => u.role === "BUYER").length : 0,
  };

  return (
    <div className="page">
      <DashboardClient
        user={user}
        stats={stats}
        products={products.map(toProductDTO)}
        sellers={sellers}
        users={users}
      />
    </div>
  );
}
