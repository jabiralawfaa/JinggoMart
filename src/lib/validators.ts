import { KATEGORI_LIST } from "./constants";
import type { Kategori, Role } from "@/types";

export type FieldErrors = Record<string, string>;

export type ProductInput = {
  nama: string;
  kategori: Kategori;
  harga: number;
  stok: number;
  deskripsi: string;
  imageUrl: string;
  unggulan: boolean;
  sellerId?: string;
};

export function validateProduct(
  body: Record<string, unknown>
): { data?: ProductInput; errors?: FieldErrors } {
  const errors: FieldErrors = {};

  const nama = typeof body.nama === "string" ? body.nama.trim() : "";
  const kategori = body.kategori as string | undefined;
  const harga = body.harga as string | number | undefined;
  const stok = body.stok as string | number | undefined;
  const deskripsi =
    typeof body.deskripsi === "string" ? body.deskripsi.trim() : "";
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const unggulan = Boolean(body.unggulan);
  const sellerId =
    typeof body.sellerId === "string" && body.sellerId.trim()
      ? body.sellerId.trim()
      : undefined;

  if (!nama) errors.nama = "Nama produk wajib diisi.";
  else if (nama.length > 60) errors.nama = "Maksimal 60 karakter.";

  if (!kategori || !KATEGORI_LIST.includes(kategori as Kategori))
    errors.kategori = "Kategori harus salah satu: Makanan, Minuman, Kerajinan.";

  const hargaNum = harga === "" || harga == null ? NaN : Number(harga);
  if (Number.isNaN(hargaNum) || hargaNum < 0)
    errors.harga = "Harga harus angka >= 0.";

  const stokNum = stok === "" || stok == null ? NaN : Number(stok);
  if (
    Number.isNaN(stokNum) ||
    stokNum < 0 ||
    !Number.isInteger(stokNum)
  )
    errors.stok = "Stok harus bilangan bulat >= 0.";

  if (!deskripsi) errors.deskripsi = "Deskripsi wajib diisi.";
  else if (deskripsi.length > 200) errors.deskripsi = "Maksimal 200 karakter.";

  if (
    imageUrl &&
    !imageUrl.startsWith("data:image/") &&
    !/^https?:\/\//i.test(imageUrl)
  )
    errors.imageUrl = "Gambar harus URL http(s) atau hasil upload.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      nama,
      kategori: kategori as Kategori,
      harga: hargaNum,
      stok: stokNum,
      deskripsi,
      imageUrl,
      unggulan,
      sellerId,
    },
  };
}

export type RegisterInput = {
  email: string;
  nama: string;
  password: string;
  confirmPassword: string;
  role: "SELLER" | "BUYER";
};

// Regex ketat: tolak karakter metacharacter (anti-injection) — query sudah parameterized via Prisma.
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateRegister(
  body: Record<string, unknown>
): { data?: RegisterInput; errors?: FieldErrors } {
  const errors: FieldErrors = {};
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const nama = typeof body.nama === "string" ? body.nama.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  const role = body.role === "SELLER" ? "SELLER" : "BUYER";

  if (!email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_REGEX.test(email))
    errors.email = "Format email tidak valid.";

  if (!nama) errors.nama = "Nama wajib diisi.";
  else if (nama.length > 80) errors.nama = "Maksimal 80 karakter.";

  if (password.length < 6) errors.password = "Password minimal 6 karakter.";

  if (password !== confirmPassword) errors.confirmPassword = "Konfirmasi password tidak cocok.";

  if (Object.keys(errors).length > 0) return { errors };
  return { data: { email, nama, password, confirmPassword, role } };
}

export function validateLogin(
  body: Record<string, unknown>
): { data?: { email: string; password: string }; errors?: FieldErrors } {
  const errors: FieldErrors = {};
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format email tidak valid.";
  if (!password) errors.password = "Password wajib diisi.";

  if (Object.keys(errors).length > 0) return { errors };
  return { data: { email, password } };
}

export function isRole(v: unknown): v is Role {
  return v === "ADMIN" || v === "SELLER" || v === "BUYER";
}
