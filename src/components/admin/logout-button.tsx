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
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
    >
      <LogOut className="size-5" aria-hidden />
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
