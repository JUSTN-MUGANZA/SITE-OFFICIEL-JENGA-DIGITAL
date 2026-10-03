import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { getCurrentAdmin } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <AuthShell title="Connexion" subtitle="Espace administrateur" intro="Connectez-vous pour accéder au tableau de bord de gestion de votre site.">
      <LoginForm />
    </AuthShell>
  );
}
