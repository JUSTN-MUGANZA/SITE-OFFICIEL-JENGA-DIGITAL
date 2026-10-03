import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Administration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connectez-vous pour gérer le site.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
