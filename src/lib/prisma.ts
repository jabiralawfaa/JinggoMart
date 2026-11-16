import { PrismaClient } from "@prisma/client";

// Singleton PrismaClient agar tidak membuat banyak koneksi saat hot-reload dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
