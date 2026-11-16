"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
  /** When true (default), non-buyers are redirected to /register instead of the link. */
  gate?: boolean;
};

/**
 * Renders an anchor that only follows its href for BUYER users.
 * Guests and SELLER/ADMIN are redirected to /register.
 */
export default function BuyerGateLink({
  href,
  children,
  gate = true,
  onClick,
  ...rest
}: Props) {
  const router = useRouter();
  const { user, loading } = useUser();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (!gate) return; // let the anchor do its thing
    // Selama status user belum diketahui, blokir klik dulu (jangan redirect buta).
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user?.role !== "BUYER") {
      e.preventDefault();
      router.push("/register");
    }
  }

  if (href.startsWith("/") || !href.startsWith("http")) {
    return (
      <Link href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}