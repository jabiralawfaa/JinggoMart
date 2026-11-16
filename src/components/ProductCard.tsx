"use client";

import { productImage } from "@/lib/placeholder";
import { formatRupiah, waLink } from "@/lib/format";
import type { ProductDTO } from "@/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const habis = product.stok <= 0;
  const img = productImage(product.imageUrl, product.kategori);
  const fallback = productImage("", product.kategori);

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
        >
          Pesan via WhatsApp
        </a>
      )}
    </article>
  );
}
