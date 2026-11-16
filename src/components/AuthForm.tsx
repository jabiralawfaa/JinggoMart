"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Errors = Record<string, string>;

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SELLER" | "BUYER">("BUYER");
  const [errors, setErrors] = useState<Errors>({});
  const [general, setGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneral("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login" ? { email, password } : { email, nama, password, role };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.errors) setErrors(data.errors);
      setGeneral(data.error || "Terjadi kesalahan.");
      return;
    }

    const dest = data.user.role === "BUYER" ? "/" : "/dashboard";
    router.push(dest);
    router.refresh();
  }

  return (
    <div className="auth-card">
      <h1>{mode === "login" ? "Masuk" : "Daftar Akun"}</h1>
      <p className="auth-sub">
        {mode === "login"
          ? "Masuk untuk mengelola katalog produk."
          : "Buat akun pembeli atau penjual (seller)."}
      </p>

      {general && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#B91C1C",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          {general}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "register" && (
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap *</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className={errors.nama ? "invalid" : ""}
            />
            <span className="error">{errors.nama}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "invalid" : ""}
          />
          <span className="error">{errors.email}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "invalid" : ""}
          />
          <span className="error">{errors.password}</span>
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Daftar sebagai</label>
            <div style={{ display: "flex", gap: 18 }}>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="role"
                  checked={role === "BUYER"}
                  onChange={() => setRole("BUYER")}
                />
                Pembeli
              </label>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="role"
                  checked={role === "SELLER"}
                  onChange={() => setRole("SELLER")}
                />
                Penjual (Seller)
              </label>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
        {mode === "login" ? (
          <>
            Belum punya akun?{" "}
            <Link href="/register" style={{ fontWeight: 700, color: "var(--ink)" }}>
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ fontWeight: 700, color: "var(--ink)" }}>
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
