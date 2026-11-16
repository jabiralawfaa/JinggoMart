import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import CartButton from "./CartButton";
import type { Role } from "@/types";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  SELLER: "Seller",
  BUYER: "Pembeli",
};

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header>
      <div className="header-inner">
        <Link href="/" aria-label="JinggoMart — Beranda">
          <Logo className="logo" />
        </Link>

        <nav className="main-links" aria-label="Navigasi halaman">
          <Link href="/#top">Beranda</Link>
          <Link href="/#koleksi">Koleksi</Link>
          <Link href="/#cerita">Cerita</Link>
        </nav>

        <div className="header-right">
          <ThemeToggle />
          <CartButton />

          {user ? (
            <div className="nav-auth">
              <span className="user-chip">
                <span className="label">{user.nama}</span>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {ROLE_LABEL[user.role]}
                </span>
              </span>
              {(user.role === "ADMIN" || user.role === "SELLER") && (
                <Link href="/dashboard" className="primary">
                  Dashboard
                </Link>
              )}
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="logout-btn">
                  Keluar
                </button>
              </form>
            </div>
          ) : (
            <div className="nav-auth">
              <Link href="/login">Masuk</Link>
              <Link href="/register" className="primary">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
