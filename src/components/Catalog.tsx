"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { KATEGORI_LIST } from "@/lib/constants";
import type { ProductDTO } from "@/types";

type SortKey = "nama-asc" | "nama-desc" | "harga-asc" | "harga-desc" | "stok-desc";

export default function Catalog({
  products,
  initialKategori,
}: {
  products: ProductDTO[];
  initialKategori: string;
}) {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<string>(initialKategori || "all");
  const [sort, setSort] = useState<SortKey>("nama-asc");
  const prevKategori = useRef(initialKategori);

  // Sinkronkan kategori saat berpindah via pintasan footer / tombol "Gas Belanja".
  // Tidak scroll saat render pertama; hanya saat kategori berubah karena navigasi.
  useEffect(() => {
    if (prevKategori.current === initialKategori) return;
    prevKategori.current = initialKategori;
    setKategori(initialKategori || "all");
    document
      .getElementById("koleksi")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialKategori]);

  const filtered = useMemo(() => {
    const list = products.slice();
    const q = search.trim().toLowerCase();
    const result = list.filter((p) => {
      const okKategori = kategori === "all" || p.kategori === kategori;
      const okSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.deskripsi.toLowerCase().includes(q);
      return okKategori && okSearch;
    });
    switch (sort) {
      case "nama-asc":
        result.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case "nama-desc":
        result.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
      case "harga-asc":
        result.sort((a, b) => a.harga - b.harga);
        break;
      case "harga-desc":
        result.sort((a, b) => b.harga - a.harga);
        break;
      case "stok-desc":
        result.sort((a, b) => b.stok - a.stok);
        break;
    }
    return result;
  }, [products, search, kategori, sort]);

  return (
    <div id="koleksi" className="section" style={{ marginTop: 56 }}>
      <div className="section-head">
        <h2>Koleksi Produk</h2>
        <span className="count-pill">{filtered.length} produk</span>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Cari produk atau deskripsi..."
          aria-label="Cari produk"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Filter kategori">
          {["all", ...KATEGORI_LIST].map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${kategori === k ? "active" : ""}`}
              onClick={() => setKategori(k)}
            >
              {k === "all" ? "Semua" : k}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          aria-label="Urutkan produk"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="nama-asc">Nama A-Z</option>
          <option value="nama-desc">Nama Z-A</option>
          <option value="harga-asc">Harga termurah</option>
          <option value="harga-desc">Harga termahal</option>
          <option value="stok-desc">Stok terbanyak</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <h3>Tidak ada produk</h3>
          <p>Coba ubah kata kunci pencarian atau filter kategori.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
