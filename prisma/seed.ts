import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ===== Data dummy awal =====
// 8 produk contoh Banyuwangi (dari SPEC.md Lampiran A) + 2 produk untuk seller kedua.

type SeedProduct = {
  nama: string;
  kategori: "Makanan" | "Minuman" | "Kerajinan";
  harga: number;
  stok: number;
  deskripsi: string;
  unggulan: boolean;
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    nama: "Nasi Jinggo Original",
    kategori: "Makanan",
    harga: 8000,
    stok: 50,
    deskripsi:
      "Paket nasi Jinggo khas Banyuwangi dengan sambal terasi, mi, dan sate.",
    unggulan: true,
  },
  {
    nama: "Rujak Soto Bu Tin",
    kategori: "Makanan",
    harga: 15000,
    stok: 25,
    deskripsi:
      "Perpaduan rujak buah dan soto daging khas Banyuwangi, segar dan pedas.",
    unggulan: true,
  },
  {
    nama: "Kopi Robusta Ijen",
    kategori: "Minuman",
    harga: 35000,
    stok: 100,
    deskripsi:
      "Kopi robusta single origin dari lereng Gunung Ijen, aroma kuat, keasaman rendah.",
    unggulan: true,
  },
  {
    nama: "Sego Tempong Pedas",
    kategori: "Makanan",
    harga: 12000,
    stok: 30,
    deskripsi:
      "Nasi dengan sambal tempong super pedas khas Banyuwangi dan lauk pilihan.",
    unggulan: false,
  },
  {
    nama: "Keripik Tempe Srenget",
    kategori: "Makanan",
    harga: 10000,
    stok: 80,
    deskripsi: "Keripik tempe tipis dan renyah, camilan favorit warga Banyuwangi.",
    unggulan: false,
  },
  {
    nama: "Wedang Telang Asli",
    kategori: "Minuman",
    harga: 7000,
    stok: 60,
    deskripsi:
      "Minuman bunga telang hangat, berwarna biru alami dan menyegarkan.",
    unggulan: false,
  },
  {
    nama: "Batik Gajah Oling",
    kategori: "Kerajinan",
    harga: 75000,
    stok: 15,
    deskripsi:
      "Kain batik motif Gajah Oling, motif khas Banyuwangi tertua, ukuran 2x1 m.",
    unggulan: true,
  },
  {
    nama: "Kemplang Ikan Belanak",
    kategori: "Makanan",
    harga: 20000,
    stok: 40,
    deskripsi:
      "Kerupuk ikan belanak gurih, lauk pendamping sempurna untuk nasi Jinggo.",
    unggulan: false,
  },
];

const SELLER2_PRODUCTS: SeedProduct[] = [
  {
    nama: "Madu Kaliandra Ijen",
    kategori: "Makanan",
    harga: 45000,
    stok: 20,
    deskripsi: "Madu murni kaliandra dari kawasan hutan Gunung Ijen.",
    unggulan: false,
  },
  {
    nama: "Miniatur Kuntul Barong",
    kategori: "Kerajinan",
    harga: 60000,
    stok: 12,
    deskripsi: "Miniatur burung kuntul barong ukiran kayu, maskot Banyuwangi.",
    unggulan: true,
  },
];

async function main() {
  console.log("🌱 Menyiapkan data dummy JinggoMart...");

  // ---- Users (password dummy, hash bcrypt) ----
  const users = [
    { email: "admin@jinggomart.id", nama: "Admin JinggoMart", role: "ADMIN" as const, password: "admin123" },
    { email: "seller@jinggomart.id", nama: "Toko Sumber Osing", role: "SELLER" as const, password: "seller123" },
    { email: "seller2@jinggomart.id", nama: "Oleh-oleh Blambangan", role: "SELLER" as const, password: "seller123" },
    { email: "pembeli@jinggomart.id", nama: "Sinta Pembeli", role: "BUYER" as const, password: "pembeli123" },
  ];

  const created: Record<string, string> = {};
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { nama: u.nama, role: u.role },
      create: { email: u.email, nama: u.nama, role: u.role, password: passwordHash },
    });
    // Selalu set password agar akun dummy konsisten saat seed diulang.
    await prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });
    created[u.email] = user.id;
    console.log(`  ✓ user ${u.email} (${u.role})`);
  }

  const sellerId = created["seller@jinggomart.id"];
  const seller2Id = created["seller2@jinggomart.id"];

  // ---- Products ----
  await prisma.product.deleteMany();
  const all = [
    ...SEED_PRODUCTS.map((p) => ({ ...p, sellerId })),
    ...SELLER2_PRODUCTS.map((p) => ({ ...p, sellerId: seller2Id })),
  ];
  for (const p of all) {
    await prisma.product.create({ data: p });
  }
  console.log(`  ✓ ${all.length} produk dibuat (${SEED_PRODUCTS.length} untuk seller utama).`);

  console.log("✅ Seed selesai.");
  console.log("\n🔑 Akun dummy:");
  console.log("  Admin   : admin@jinggomart.id   / admin123");
  console.log("  Seller  : seller@jinggomart.id  / seller123");
  console.log("  Seller2 : seller2@jinggomart.id / seller123");
  console.log("  Pembeli : pembeli@jinggomart.id / pembeli123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
