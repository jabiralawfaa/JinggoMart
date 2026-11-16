"use client";

import { useEffect, useState } from "react";
import type { SessionUser } from "@/types";

type Result = {
  user: SessionUser | null;
  loading: boolean;
};

type MeResponse = { user: SessionUser } | { user: null };

let cache: SessionUser | null | undefined;

function readCache(): SessionUser | null | undefined {
  return cache;
}

function setCache(u: SessionUser | null) {
  cache = u;
}

// Panggil setelah login/register sukses: cache perlu di-reset karena
// navigasi client-side (router.push) tidak membuat fetch ulang otomatis.
export function resetUserCache() {
  cache = undefined;
}

export function useUser(): Result {
  const [state, setState] = useState<Result>({
    user: readCache() ?? null,
    loading: readCache() === undefined,
  });

  useEffect(() => {
    if (readCache() !== undefined) return; // already fetched
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: MeResponse | null) => {
        if (cancelled) return;
        const u = data?.user ?? null;
        setCache(u);
        setState({ user: u, loading: false });
      })
      .catch(() => {
        if (cancelled) return;
        setCache(null);
        setState({ user: null, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}