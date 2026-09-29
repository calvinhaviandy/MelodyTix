"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type User } from "./api";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const data = await api<{ user: User | null }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onAuthChange = () => { void refresh(); };
    window.addEventListener("melodytix:auth-changed", onAuthChange);
    return () => window.removeEventListener("melodytix:auth-changed", onAuthChange);
  }, [refresh]);

  return { user, loading, refresh, setUser };
}
