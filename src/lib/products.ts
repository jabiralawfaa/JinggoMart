import type { Kategori, ProductDTO } from "@/types";

export type ProductRow = {
  id: string;
  nama: string;
  kategori: Kategori;
  harga: number;
  stok: number;
  deskripsi: string;
  imageUrl: string;
  unggulan: boolean;
  sellerId: string;
  seller: { nama: string };
  createdAt: Date;
};

export function toProductDTO(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    nama: p.nama,
    kategori: p.kategori,
    harga: p.harga,
    stok: p.stok,
    deskripsi: p.deskripsi,
    imageUrl: p.imageUrl,
    unggulan: p.unggulan,
    sellerId: p.sellerId,
    sellerNama: p.seller.nama,
    createdAt: p.createdAt.toISOString(),
  };
}
