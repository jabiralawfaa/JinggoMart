// Konstanta konfigurasi JinggoMart (dipakai di sisi server maupun client).
// Nomor toko: 081234567890 (format Indonesia) → wa.me 6281234567890.
export const WA_NUMBER = "6281234567890";

export const KATEGORI_LIST = ["Makanan", "Minuman", "Kerajinan"] as const;

export const KATEGORI_THEME: Record<string, string> = {
  Makanan: "#FFD83D",
  Minuman: "#8FDDD2",
  Kerajinan: "#F9A8D4",
};

export const WA_DISPLAY = "0812-3456-7890";

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const IMAGE_MAX_DIM = 800; // px
export const IMAGE_QUALITY = 0.85; // JPEG quality
