"use client";

import { useEffect, useState } from "react";
import { KATEGORI_LIST, IMAGE_MAX_BYTES, IMAGE_MAX_DIM, IMAGE_QUALITY } from "@/lib/constants";
import { placeholderImage } from "@/lib/placeholder";
import type { ProductDTO } from "@/types";

type SellerOption = { id: string; nama: string; email: string };

type Props = {
  open: boolean;
  product: ProductDTO | null;
  sellers: SellerOption[];
  isAdmin: boolean;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string, type?: "success" | "error") => void;
};

type FormState = {
  nama: string;
  kategori: string;
  harga: string;
  stok: string;
  deskripsi: string;
  imageUrl: string;
  unggulan: boolean;
  sellerId: string;
};

const EMPTY: FormState = {
  nama: "",
  kategori: "",
  harga: "",
  stok: "",
  deskripsi: "",
  imageUrl: "",
  unggulan: false,
  sellerId: "",
};

export default function ProductFormModal({
  open,
  product,
  sellers,
  isAdmin,
  onClose,
  onSaved,
  notify,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [imageData, setImageData] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        nama: product.nama,
        kategori: product.kategori,
        harga: String(product.harga),
        stok: String(product.stok),
        deskripsi: product.deskripsi,
        imageUrl: product.imageUrl || "",
        unggulan: product.unggulan,
        sellerId: product.sellerId,
      });
    } else {
      setForm({ ...EMPTY, sellerId: sellers[0]?.id || "" });
    }
    setImageData("");
    setErrors({});
  }, [open, product, sellers]);

  if (!open) return null;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.nama.trim()) next.nama = "Nama produk wajib diisi.";
    if (!KATEGORI_LIST.includes(form.kategori as never)) next.kategori = "Kategori harus dipilih.";
    const harga = Number(form.harga);
    if (form.harga === "" || Number.isNaN(harga) || harga < 0) next.harga = "Harga harus angka >= 0.";
    const stok = Number(form.stok);
    if (form.stok === "" || Number.isNaN(stok) || stok < 0 || !Number.isInteger(stok))
      next.stok = "Stok harus bilangan bulat >= 0.";
    if (!form.deskripsi.trim()) next.deskripsi = "Deskripsi wajib diisi.";
    if (isAdmin && !form.sellerId) next.sellerId = "Pilih penjual (seller).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function processImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      notify("File harus berupa gambar.", "error");
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      notify("Ukuran gambar maksimal 5 MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > h && w > IMAGE_MAX_DIM) {
          h = Math.round((h * IMAGE_MAX_DIM) / w);
          w = IMAGE_MAX_DIM;
        } else if (h > IMAGE_MAX_DIM) {
          w = Math.round((w * IMAGE_MAX_DIM) / h);
          h = IMAGE_MAX_DIM;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        setImageData(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
        notify("Gambar siap disimpan.", "success");
      };
      img.onerror = () => notify("Gagal memuat gambar.", "error");
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      nama: form.nama.trim(),
      kategori: form.kategori,
      harga: Number(form.harga),
      stok: Number(form.stok),
      deskripsi: form.deskripsi.trim(),
      imageUrl: imageData || form.imageUrl.trim(),
      unggulan: form.unggulan,
      sellerId: isAdmin ? form.sellerId : undefined,
    };

    const res = await fetch(
      product ? `/api/products/${product.id}` : "/api/products",
      {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      if (data.errors) setErrors(data.errors);
      notify(data.error || "Gagal menyimpan produk.", "error");
      return;
    }
    notify(product ? "Produk diperbarui. ✨" : "Produk ditambahkan. 🎉", "success");
    onSaved();
    onClose();
  }

  const previewSrc = imageData || form.imageUrl || placeholderImage(form.kategori || "Makanan");

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 id="modal-title">{product ? "Edit Produk" : "Tambah Produk"}</h3>
          <button className="modal-close" aria-label="Tutup" type="button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="f-nama">Nama Produk *</label>
              <input
                id="f-nama"
                type="text"
                maxLength={60}
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                className={errors.nama ? "invalid" : ""}
              />
              <span className="error">{errors.nama}</span>
            </div>

            <div className="form-group">
              <label htmlFor="f-kategori">Kategori *</label>
              <select
                id="f-kategori"
                value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                className={errors.kategori ? "invalid" : ""}
              >
                <option value="">Pilih kategori</option>
                {KATEGORI_LIST.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <span className="error">{errors.kategori}</span>
            </div>

            {isAdmin && (
              <div className="form-group">
                <label htmlFor="f-seller">Penjual (Seller) *</label>
                <select
                  id="f-seller"
                  value={form.sellerId}
                  onChange={(e) => set("sellerId", e.target.value)}
                  className={errors.sellerId ? "invalid" : ""}
                >
                  <option value="">Pilih penjual</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.email})
                    </option>
                  ))}
                </select>
                <span className="error">{errors.sellerId}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label htmlFor="f-harga">Harga (Rp) *</label>
                <input
                  id="f-harga"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form.harga}
                  onChange={(e) => set("harga", e.target.value)}
                  className={errors.harga ? "invalid" : ""}
                />
                <span className="error">{errors.harga}</span>
              </div>
              <div className="form-group">
                <label htmlFor="f-stok">Stok *</label>
                <input
                  id="f-stok"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={form.stok}
                  onChange={(e) => set("stok", e.target.value)}
                  className={errors.stok ? "invalid" : ""}
                />
                <span className="error">{errors.stok}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="f-deskripsi">Deskripsi *</label>
              <textarea
                id="f-deskripsi"
                maxLength={200}
                value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                className={errors.deskripsi ? "invalid" : ""}
              />
              <span className="error">{errors.deskripsi}</span>
            </div>

            <div className="form-group">
              <label>Gambar Produk</label>
              <div className="image-input-group">
                <div className="image-preview" aria-live="polite">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="Pratinjau gambar produk" />
                </div>
                <div className="image-inputs">
                  <label className="file-pick-btn" htmlFor="f-image-file">
                    📁 Pilih File
                  </label>
                  <input
                    id="f-image-file"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processImageFile(file);
                    }}
                  />
                  <span className="or-divider">atau URL gambar</span>
                  <input
                    type="url"
                    placeholder="https://... (opsional)"
                    value={form.imageUrl}
                    onChange={(e) => {
                      setImageData("");
                      set("imageUrl", e.target.value);
                    }}
                  />
                </div>
              </div>
              <span className="error">{errors.imageUrl}</span>
              <small className="hint">
                Maks 5 MB. Gambar dikompres otomatis ke 800px (JPEG q 0.85).
              </small>
            </div>

            <div className="form-group checkbox-row">
              <input
                id="f-unggulan"
                type="checkbox"
                checked={form.unggulan}
                onChange={(e) => set("unggulan", e.target.checked)}
              />
              <label htmlFor="f-unggulan" style={{ fontWeight: "normal" }}>
                ⭐ Tandai sebagai produk unggulan
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
