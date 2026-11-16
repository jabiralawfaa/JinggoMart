"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/keranjang"
      className="cart-btn"
      aria-label={
        count > 0
          ? `Keranjang (${count} barang)`
          : "Keranjang belanja"
      }
      title="Keranjang belanja"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 6h15l-2 11H7L4 6z" />
        <path d="M6 6L5 3H2" />
        <circle cx="10" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
      </svg>
      {count > 0 && <span className="cart-badge" aria-hidden="true">{count}</span>}
    </Link>
  );
}