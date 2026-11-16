import { WA_NUMBER } from "./constants";

export function formatRupiah(n: number): string {
  const num = Number(n) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

export function waLink(nama: string, harga: number): string {
  const text = `Halo JinggoMart, saya ingin memesan:\n\n*${nama}*\nHarga: ${formatRupiah(
    harga
  )}\n\nApakah produk ini masih tersedia?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
