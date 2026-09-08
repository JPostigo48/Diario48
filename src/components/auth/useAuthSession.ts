"use client";

import { useCallback, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
};

type AuthSessionResponse = {
  data?: {
    user: AuthUser;
  } | null;
  error?: string;
};

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const readSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const payload = (await response.json()) as AuthSessionResponse;

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo obtener la sesión actual.");
      }

      setUser(payload.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    await readSession();
  }, [readSession]);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      throw new Error(payload.error || "No se pudo cerrar sesión.");
    }

    setUser(null);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void readSession();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [readSession]);

  return {
    user,
    isLoading,
    refreshSession,
    logout,
    isAuthenticated: Boolean(user),
  };
}
