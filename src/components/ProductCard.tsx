"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productImage } from "@/lib/placeholder";
import { formatRupiah, waLink } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import { useUser } from "@/lib/useUser";
import type { ProductDTO } from "@/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const { add } = useCart();
  const { user, loading } = useUser();

  const habis = product.stok <= 0;
  const img = productImage(product.imageUrl, product.kategori);
  const fallback = productImage("", product.kategori);

  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (habis) return;
    add(
      {
        id: product.id,
        nama: product.nama,
        harga: product.harga,
        stok: product.stok,
        kategori: product.kategori,
        sellerNama: product.sellerNama,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handlePesan(e: React.MouseEvent<HTMLAnchorElement>) {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user?.role !== "BUYER") {
      e.preventDefault();
      router.push("/register");
    }
  }

  return (
    <article className="card">
      <div className="card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="card-image"
          src={img}
          alt={product.nama}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            el.onerror = null;
            el.src = fallback;
          }}
        />
        {product.unggulan && <span className="badge-unggulan">⭐ Unggulan</span>}
        <span className="badge-kategori">{product.kategori}</span>
      </div>
      <div className="card-row">
        <div className="card-nama">{product.nama}</div>
        <div className={`card-stok ${habis ? "habis" : ""}`}>
          {habis ? "Stok habis" : `Stok: ${product.stok}`}
        </div>
      </div>
      <div className="card-harga">{formatRupiah(product.harga)}</div>
      <div className="card-deskripsi">{product.deskripsi}</div>
      <div className="card-seller">oleh {product.sellerNama}</div>
      <div className="card-actions">
        <button
          type="button"
          className="btn-cart"
          disabled={habis}
          onClick={handleAdd}
          aria-label={` tambahkan ${product.nama} ke keranjang`}
        >
          {added ? "✓ Ditambahkan" : "🛒 Tambah ke Keranjang"}
        </button>
        {habis ? (
          <button className="btn-wa disabled" disabled aria-disabled="true">
            Stok habis
          </button>
        ) : (
          <a
            className="btn-wa"
            href={waLink(product.nama, product.harga)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePesan}
          >
            Pesan via WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}