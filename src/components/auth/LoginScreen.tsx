"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginScreenProps = {
  nextPath?: string;
};

export default function LoginScreen({ nextPath }: LoginScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo iniciar sesión.");
      }

      router.refresh();
      router.push(nextPath || "/");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--d48-bg)] px-6 py-10 text-[var(--d48-text)]">
      <div className="w-full max-w-[420px] rounded-2xl border border-[var(--br)] bg-[var(--bg2)] p-6 shadow-xl">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-[var(--acc)]">
            {"// acceso"}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--tx)]">Iniciar sesión</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--tx3)]">
            Entra con tu cuenta para acceder a tus herramientas privadas y recuperar tu
            espacio de trabajo.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block font-mono text-[11px] text-[var(--tx3)]" htmlFor="email">
              email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--tx)] outline-none focus:border-[var(--acc)]"
              placeholder="tu-correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block font-mono text-[11px] text-[var(--tx3)]"
              htmlFor="password"
            >
              contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--tx)] outline-none focus:border-[var(--acc)]"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {nextPath ? (
            <div className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-xs text-[var(--tx3)]">
              Primero debes iniciar sesión para acceder a:{" "}
              <span className="font-mono text-[var(--tx)]">{nextPath}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded border border-[var(--acc3)] bg-[var(--acc2)] px-4 py-2 font-mono text-sm font-semibold text-[var(--acc)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "validando…" : "entrar"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--br)] pt-4 text-xs text-[var(--tx4)]">
          <span>Acceso local temporal por email + contraseña.</span>
          <Link href="/" className="font-mono text-[var(--tx3)] hover:text-[var(--tx)]">
            volver
          </Link>
        </div>
      </div>
    </main>
  );
}
