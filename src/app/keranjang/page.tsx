"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useUser } from "@/lib/useUser";
import { formatRupiah, waOrderLink } from "@/lib/format";

export default function KeranjangPage() {
  const router = useRouter();
  const { items, remove, setQty, clear, total } = useCart();
  const { user, loading } = useUser();

  function handleCheckout(e: React.MouseEvent<HTMLAnchorElement>) {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user?.role !== "BUYER") {
      e.preventDefault();
      router.push("/register");
    }
  }

  const orderItems = useMemo(
    () =>
      items.map((it) => ({
        nama: it.nama,
        qty: it.qty,
        subtotal: it.harga * it.qty,
      })),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="page keranjang-page">
        <div className="empty">
          <h3>Keranjang belanja masih kosong</h3>
          <p>Tambahkan produk dari katalog, lalu kembali ke sini.</p>
          <Link className="btn-primary" href="/#koleksi">
            Gas Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page keranjang-page">
      <h1 className="section-title">Keranjang Belanja</h1>
      <p className="section-sub">
        {items.length} barang · Total{" "}
        <strong>{formatRupiah(total)}</strong>
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Harga</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <div className="cart-item-name">{it.nama}</div>
                  <div className="cart-item-meta">
                    {it.sellerNama} · {it.kategori}
                  </div>
                </td>
                <td>{formatRupiah(it.harga)}</td>
                <td>
                  <div className="qty-row">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Kurangi qty"
                      onClick={() => setQty(it.id, it.qty - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{it.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Tambah qty"
                      disabled={it.qty >= it.stok}
                      onClick={() => setQty(it.id, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatRupiah(it.harga * it.qty)}</td>
                <td>
                  <button
                    type="button"
                    className="flink"
                    onClick={() => remove(it.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total belanja</span>
          <strong>{formatRupiah(total)}</strong>
        </div>
        <div className="cart-actions-row">
          <button type="button" className="btn btn-secondary" onClick={clear}>
            Kosongkan
          </button>
          <a
            className="btn btn-wa"
            href={waOrderLink(orderItems)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCheckout}
          >
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}