"use client";

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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

  return (
    <div className="space-y-5">
      {error ? <Alert tone="error">{error}</Alert> : null}
      <form onSubmit={onPassword} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Mot de passe" name="password" type="password" autoComplete="current-password" required />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button type="button" variant="secondary" disabled={pending} onClick={onGoogle} className="w-full">
        Continuer avec Google
      </Button>
      <p className="text-center text-sm">
        <Link href="/admin/mot-de-passe-oublie" className="text-brand hover:underline">
          Mot de passe oublié ?
        </Link>
      </p>
    </div>
  );
}
