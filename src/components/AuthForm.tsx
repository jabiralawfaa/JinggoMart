"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetUserCache } from "@/lib/useUser";

type Errors = Record<string, string>;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"SELLER" | "BUYER">("BUYER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [general, setGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneral("");

    // Client-side validation
    const clientErrors: Errors = {};

    if (!email) clientErrors.email = "Email wajib diisi.";
    else if (!EMAIL_REGEX.test(email)) clientErrors.email = "Format email tidak valid.";

    if (mode === "register") {
      if (!nama) clientErrors.nama = "Nama wajib diisi.";
      if (password.length < 6) clientErrors.password = "Password minimal 6 karakter.";
      if (password !== confirmPassword) clientErrors.confirmPassword = "Konfirmasi password tidak cocok.";
    } else {
      if (!password) clientErrors.password = "Password wajib diisi.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { email, password }
        : { email, nama, password, confirmPassword, role };

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
    resetUserCache();
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
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "invalid" : ""}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: 18,
                lineHeight: 1,
                padding: 0,
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <span className="error">{errors.password}</span>
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password *</label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "invalid" : ""}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
            <span className="error">{errors.confirmPassword}</span>
          </div>
        )}

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
