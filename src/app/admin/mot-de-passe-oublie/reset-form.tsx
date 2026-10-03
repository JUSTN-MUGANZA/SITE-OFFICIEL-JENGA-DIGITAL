"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { clientAuth } from "@/lib/firebase/client";

export function ResetForm() {
  const [state, setState] = useState<"idle" | "pending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setState("pending");
    try {
      const auth = await clientAuth();
      await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}/admin/login` });
      setState("sent");
    } catch (e) {
      // On n'indique pas si l'adresse existe : même message dans les deux cas.
      setState((e as { code?: string }).code === "auth/user-not-found" ? "sent" : "error");
    }
  }

  return (
    <div className="space-y-4">
      {state === "sent" ? (
        <Alert tone="success">Si un compte existe pour cette adresse, un email vient de lui être envoyé.</Alert>
      ) : null}
      {state === "error" ? <Alert tone="error">L&apos;envoi a échoué. Vérifiez l&apos;adresse et réessayez.</Alert> : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Button type="submit" disabled={state === "pending"} className="w-full">
          {state === "pending" ? "Envoi…" : "Recevoir le lien"}
        </Button>
      </form>
      <p className="text-center text-sm">
        <Link href="/admin/login" className="text-brand hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
