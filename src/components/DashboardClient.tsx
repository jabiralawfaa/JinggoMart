"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductFormModal from "./ProductFormModal";
import { productImage } from "@/lib/placeholder";
import { formatRupiah } from "@/lib/format";
import type { ProductDTO, SessionUser, Stats, UserDTO } from "@/types";

type SellerOption = { id: string; nama: string; email: string };
type Toast = { msg: string; type: "success" | "error" } | null;

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  SELLER: "Seller",
  BUYER: "Pembeli",
};

export default function DashboardClient({
  user,
  stats,
  products,
  sellers,
  users,
}: {
  user: SessionUser;
  stats: Stats;
  products: ProductDTO[];
  sellers: SellerOption[];
  users: UserDTO[];
}) {
  const router = useRouter();
  const isAdmin = user.role === "ADMIN";

  const [tab, setTab] = useState<"produk" | "pengguna">("produk");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  function notify(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  async function deleteProduct(id: string) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (!confirm(`Hapus produk "${p.nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      notify("Produk dihapus.", "success");
      router.refresh();
    } else {
      const data = await res.json();
      notify(data.error || "Gagal menghapus produk.", "error");
    }
  }

  async function updateRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      notify("Role diperbarui.", "success");
      router.refresh();
    } else {
      const data = await res.json();
      notify(data.error || "Gagal mengubah role.", "error");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Hapus akun ini beserta produknya?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      notify("Akun dihapus.", "success");
      router.refresh();
    } else {
      const data = await res.json();
      notify(data.error || "Gagal menghapus akun.", "error");
    }
  }

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(p: ProductDTO) {
    setEditing(p);
    setModalOpen(true);
  }

  const summaryCards = [
    { label: "Total Produk", value: stats.totalProduk, icon: "🛍️", cls: "" },
    { label: "Total Stok", value: stats.totalStok.toLocaleString("id-ID"), icon: "📦", cls: "accent" },
    { label: "Total Kategori", value: stats.totalKategori, icon: "🏷️", cls: "wa" },
    { label: "Produk Unggulan", value: stats.totalUnggulan, icon: "⭐", cls: "danger" },
  ];
  if (isAdmin) {
    summaryCards.push(
      { label: "Total Seller", value: stats.totalSeller, icon: "🏪", cls: "purple" },
      { label: "Total Pembeli", value: stats.totalPembeli, icon: "🛒", cls: "" }
    );
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <h1 className="section-title">
        {isAdmin ? "Dashboard Admin" : "Dashboard Pengelola"}
      </h1>
      <p className="section-sub">
        {isAdmin
          ? "Kelola seluruh produk, penjual, dan pengguna JinggoMart."
          : "Kelola produk toko kamu: unggah gambar, atur stok, tandai unggulan."}
      </p>

      <div className="summary-grid">
        {summaryCards.map((c) => (
          <div key={c.label} className={`summary-card ${c.cls}`}>
            <div className="summary-icon">{c.icon}</div>
            <div className="summary-label">{c.label}</div>
            <div className="summary-value">{c.value}</div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="tabs" role="tablist">
          <button
            type="button"
            className={tab === "produk" ? "active" : ""}
            onClick={() => setTab("produk")}
          >
            Produk
          </button>
          <button
            type="button"
            className={tab === "pengguna" ? "active" : ""}
            onClick={() => setTab("pengguna")}
          >
            Pengguna ({users.length})
          </button>
        </div>
      )}

      {tab === "produk" && (
        <>
          <div className="dashboard-toolbar">
            <h2>Daftar Produk</h2>
            <button className="btn btn-primary" type="button" onClick={openAdd}>
              + Tambah Produk
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Unggulan</th>
                  {isAdmin && <th>Penjual</th>}
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 8 : 7}
                      style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}
                    >
                      Belum ada produk. Klik “+ Tambah Produk”.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="table-thumb"
                          src={productImage(p.imageUrl, p.kategori)}
                          alt=""
                        />
                      </td>
                      <td>
                        <strong>{p.nama}</strong>
                        <br />
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>
                          {p.deskripsi.length > 40
                            ? p.deskripsi.slice(0, 40) + "…"
                            : p.deskripsi}
                        </span>
                      </td>
                      <td>{p.kategori}</td>
                      <td>{formatRupiah(p.harga)}</td>
                      <td>{p.stok}</td>
                      <td>
                        {p.unggulan ? (
                          <span className="pill">Unggulan</span>
                        ) : (
                          <span className="pill no">—</span>
                        )}
                      </td>
                      {isAdmin && <td>{p.sellerNama}</td>}
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isAdmin && tab === "pengguna" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Produk</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.nama}</strong>
                    {u.id === user.id && (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}> (kamu)</span>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`pill ${u.role.toLowerCase()}`}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td>{u._count.products}</td>
                  <td>
                    <div className="row-actions">
                      <select
                        className="role-select"
                        value={u.role}
                        disabled={u.id === user.id}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SELLER">Seller</option>
                        <option value="BUYER">Pembeli</option>
                      </select>
                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        disabled={u.id === user.id}
                        onClick={() => deleteUser(u.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        product={editing}
        sellers={sellers}
        isAdmin={isAdmin}
        onClose={() => setModalOpen(false)}
        onSaved={() => router.refresh()}
        notify={notify}
      />

      {toast && (
        <div className={`toast show ${toast.type}`} role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
