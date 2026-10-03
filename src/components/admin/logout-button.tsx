"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <LogOut className="size-4" aria-hidden />
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
