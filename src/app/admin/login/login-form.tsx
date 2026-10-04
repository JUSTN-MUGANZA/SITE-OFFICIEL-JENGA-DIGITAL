"use client";

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { authErrorMessage } from "@/lib/auth/firebase-errors";
import { clientAuth } from "@/lib/firebase/client";

async function openSession(user: User): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const idToken = await user.getIdToken(attempt > 0);
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (res.ok) return null;
    const data = (await res.json().catch(() => ({}))) as { error?: string; refresh?: boolean };
    if (!data.refresh) return data.error ?? "La connexion a échoué.";
  }
  return "La connexion a échoué. Réessayez.";
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function finish(user: User) {
    const auth = await clientAuth();
    const failure = await openSession(user);
    // La session vit dans le cookie serveur : on ne garde rien côté navigateur.
    await signOut(auth);
    if (failure) {
      setError(failure);
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function onPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setPending(true);
    try {
      const auth = await clientAuth();
      const cred = await signInWithEmailAndPassword(auth, String(form.get("email")), String(form.get("password")));
      await finish(cred.user);
    } catch (e) {
      setError(authErrorMessage((e as { code?: string }).code));
      setPending(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setPending(true);
    try {
      const auth = await clientAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      await finish(cred.user);
    } catch (e) {
      setError(authErrorMessage((e as { code?: string }).code));
      setPending(false);
    }
  }

  const input =
    "w-full rounded-lg border border-border-strong/70 bg-white py-3.5 pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <div className="space-y-5">
      {error ? <Alert tone="error">{error}</Alert> : null}
      <form onSubmit={onPassword} className="space-y-4">
        <label className="relative block">
          <span className="sr-only">Adresse e-mail</span>
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input name="email" type="email" autoComplete="email" required placeholder="Adresse e-mail" className={input} />
        </label>
        <label className="relative block">
          <span className="sr-only">Mot de passe</span>
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Mot de passe"
            className={`${input} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-brand"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 font-semibold text-white transition hover:bg-brand-mid hover:shadow-[var(--shadow-electric)] disabled:opacity-60"
        >
          <ArrowRight className="size-5" aria-hidden />
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={onGoogle}
        className="flex w-full items-center gap-4 rounded-lg border border-border bg-white px-5 py-3.5 text-left transition hover:border-brand/40 hover:bg-brand-soft/40 disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="size-7 shrink-0" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
        </svg>
        <span>
          <span className="block text-sm font-semibold text-ink">Se connecter avec Google</span>
          <span className="block text-xs text-muted-foreground">Connexion rapide et sécurisée avec votre compte Google</span>
        </span>
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/mot-de-passe-oublie" className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
          <Lock className="size-4" aria-hidden /> Mot de passe oublié ?
        </Link>
      </p>
      <p className="flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden /> Connexion sécurisée avec Firebase Authentication
      </p>
    </div>
  );
}
