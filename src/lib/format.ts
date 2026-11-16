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

/**
 * Membuat satu link wa.me berisi seluruh isi keranjang.
 * @param items daftar item keranjang (nama, qty, subtotal)
 */
export function waOrderLink(
  items: { nama: string; qty: number; subtotal: number }[]
): string {
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.qty}x ${it.qty > 1 ? "pcs" : "pc"} — ${it.nama} (${formatRupiah(it.subtotal)})`
  );
  const total = items.reduce((s, it) => s + it.subtotal, 0);
  const text =
    `Halo JinggoMart, saya ingin memesan ${items.length} barang:\n\n` +
    lines.join("\n") +
    `\n\nTotal: ${formatRupiah(total)}\n\nTerima kasih.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}