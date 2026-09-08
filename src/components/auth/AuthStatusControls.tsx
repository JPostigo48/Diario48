"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthSession } from "@/components/auth/useAuthSession";

type AuthStatusControlsProps = {
  loginHref?: string;
  nextPath?: string;
  variant?: "landing" | "tool";
};

const variantClasses = {
  landing: {
    wrapper: "flex items-center gap-2",
    userText: "text-[11px] text-(--tx3)",
    badge: "rounded border border-(--br) bg-(--bg3) px-2 py-1 font-mono text-[10px] text-(--tx3)",
    button:
      "rounded border border-(--br) bg-(--bg3) px-2.5 py-1.5 font-mono text-[11px] text-(--tx2) transition-colors hover:bg-(--bg) hover:text-(--tx)",
    primaryButton:
      "rounded border border-(--acc3) bg-(--acc2) px-2.5 py-1.5 font-mono text-[11px] text-(--acc) transition-opacity hover:opacity-85",
  },
  tool: {
    wrapper: "flex items-center gap-2",
    userText: "text-[11px] text-[var(--tx3)]",
    badge:
      "rounded border border-[var(--br)] bg-[var(--bg3)] px-2 py-1 font-mono text-[10px] text-[var(--tx3)]",
    button:
      "rounded border border-[var(--br)] bg-[var(--bg3)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)]",
    primaryButton:
      "rounded border border-[var(--acc3)] bg-[var(--acc2)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--acc)] transition-opacity hover:opacity-85",
  },
} as const;

export default function AuthStatusControls({
  loginHref = "/login",
  nextPath,
  variant = "landing",
}: AuthStatusControlsProps) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const styles = variantClasses[variant];

  const loginTarget = nextPath
    ? `${loginHref}?next=${encodeURIComponent(nextPath)}`
    : loginHref;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.refresh();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.badge}>sesión…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.userText}>sin sesión</span>
        <Link href={loginTarget} className={styles.primaryButton}>
          iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className="flex flex-col items-end">
        <span className={styles.userText}>mi espacio</span>
        <span className={styles.badge}>{user.displayName || user.email}</span>
      </div>
      <button type="button" onClick={() => void handleLogout()} className={styles.button}>
        {isLoggingOut ? "saliendo…" : "cerrar sesión"}
      </button>
    </div>
  );
}
