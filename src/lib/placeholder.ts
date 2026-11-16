import { KATEGORI_THEME } from "./constants";

// Placeholder SVG berwarna per kategori, dipakai saat imageUrl kosong.
// Mirip fungsi placeholderImage() di prototipe; aman dipakai di client.
export function placeholderImage(kategori: string): string {
  const bg = KATEGORI_THEME[kategori] || "#E9E5DF";
  const icons: Record<string, string> = {
    Makanan:
      '<path d="M110 205H290Q290 290 200 290Q110 290 110 205Z" fill="#fff"/><path d="M130 205Q200 120 270 205Z" fill="#FFF4D6"/><circle cx="238" cy="178" r="9" fill="#FF6B1A"/>',
    Minuman:
      '<path d="M140 170H250V225Q250 270 195 270Q140 270 140 225Z" fill="#fff"/><path d="M250 185Q290 190 285 220Q280 245 248 245" fill="none" stroke="#fff" stroke-width="12"/><ellipse cx="195" cy="282" rx="75" ry="10" fill="#fff" opacity=".6"/><path d="M165 150Q155 130 168 112M195 150Q185 130 198 112M225 150Q215 130 228 112" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>',
    Kerajinan:
      '<g fill="none" stroke="#fff" stroke-width="8"><circle cx="200" cy="215" r="82"/><circle cx="200" cy="215" r="56"/><circle cx="200" cy="215" r="30"/></g><circle cx="200" cy="215" r="9" fill="#FFD83D"/>',
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480">
    <rect width="400" height="480" fill="${bg}"/>
    <g fill="none" stroke="#1B2A8F" stroke-width="6" opacity=".25"><circle cx="40" cy="50" r="30"/><circle cx="40" cy="50" r="16"/><circle cx="360" cy="430" r="30"/><circle cx="360" cy="430" r="16"/></g>
    <circle cx="200" cy="215" r="125" fill="#1B2A8F"/>${icons[kategori] || ""}
    <text x="200" y="400" font-size="26" fill="#1B2A8F" text-anchor="middle" font-family="Segoe UI, sans-serif" font-weight="700">${kategori}</text>
    <text x="200" y="430" font-size="14" fill="#1B2A8F" text-anchor="middle" font-family="Segoe UI, sans-serif">JinggoMart</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export function productImage(imageUrl: string | null | undefined, kategori: string): string {
  return imageUrl && imageUrl.trim() ? imageUrl : placeholderImage(kategori);
}
