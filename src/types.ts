// Tipe bersama yang dipakai di server maupun client.

export type Role = "ADMIN" | "SELLER" | "BUYER";
export type Kategori = "Makanan" | "Minuman" | "Kerajinan";

export type SessionUser = {
  id: string;
  email: string;
  nama: string;
  role: Role;
};

export type ProductDTO = {
  id: string;
  nama: string;
  kategori: Kategori;
  harga: number;
  stok: number;
  deskripsi: string;
  imageUrl: string;
  unggulan: boolean;
  sellerId: string;
  sellerNama: string;
  createdAt: string;
};

export type UserDTO = {
  id: string;
  email: string;
  nama: string;
  role: Role;
  createdAt: string;
  _count: { products: number };
};

export type Stats = {
  totalProduk: number;
  totalStok: number;
  totalKategori: number;
  totalUnggulan: number;
  totalSeller: number;
  totalPembeli: number;
};
