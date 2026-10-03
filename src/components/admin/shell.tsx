"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Initials } from "@/components/site/visuals";
import { LogoutButton } from "./logout-button";
import { AdminNav, SiteLink, type NavItem } from "./nav";

type ShellUser = { name: string; roleLabel: string };

/** Barre latérale bleu nuit (tiroir sur mobile) + barre du haut + contenu. */
export function AdminShell({ items, user, topbar, children }: { items: NavItem[]; user: ShellUser; topbar: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  return (
    <div className="flex min-h-dvh flex-1 bg-muted">
      {open ? <button type="button" aria-label="Fermer le menu" onClick={close} className="fixed inset-0 z-40 bg-navy-950/60 lg:hidden" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto bg-navy-950 px-4 py-6 text-white transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-3">
          <Link href="/admin" onClick={close} aria-label="Tableau de bord">
            <Image src="/brand/logo-jenga-digital-white.png" alt="JENGA Digital" width={720} height={310} className="h-12 w-auto" priority />
          </Link>
          <button type="button" onClick={close} className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" aria-label="Fermer le menu">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="mt-8 flex-1 space-y-6">
          <AdminNav items={items} onNavigate={close} />
          <SiteLink onNavigate={close} />
        </div>
        <div className="navy-surface relative mt-6 overflow-hidden rounded-2xl border border-white/10 p-5 text-center">
          <Image src="/brand/logo-jenga-digital-white.png" alt="" width={720} height={310} className="mx-auto h-10 w-auto" />
          <p className="mt-3 text-sm text-white/80">Ensemble, construisons votre succès digital !</p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-2 pt-5">
          <Initials name={user.name} className="size-11 shrink-0 rounded-full text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-white/60">{user.roleLabel}</p>
          </div>
        </div>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/90 px-4 backdrop-blur sm:h-20 sm:px-6">
          <button
            type="button"
            onClick={() => setOpenOn(pathname)}
            className="inline-flex size-10 items-center justify-center rounded-xl text-ink hover:bg-muted lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            <Menu className="size-6" aria-hidden />
          </button>
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">{topbar}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
