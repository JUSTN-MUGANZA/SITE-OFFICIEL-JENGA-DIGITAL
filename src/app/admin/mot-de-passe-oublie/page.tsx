import type { Metadata } from "next";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Indiquez votre email : vous recevrez un lien pour choisir un nouveau mot de passe.
        </p>
        <div className="mt-6">
          <ResetForm />
        </div>
      </div>
    </main>
  );
}
