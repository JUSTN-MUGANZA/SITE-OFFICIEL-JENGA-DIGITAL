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

/** Barre latérale claire (tiroir sur mobile) + barre du haut + contenu. */
export function AdminShell({ items, user, topbar, children }: { items: NavItem[]; user: ShellUser; topbar: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  return (
    <div className="flex min-h-dvh flex-1 bg-background">
      {open ? <button type="button" aria-label="Fermer le menu" onClick={close} className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-white px-4 py-5 transition-transform lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" onClick={close} aria-label="Tableau de bord" className="flex items-center gap-3">
            <Image src="/brand/logo-jenga-digital-transparent.png" alt="JENGA Digital" width={640} height={276} className="h-10 w-auto" priority />
            <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand">Admin</span>
          </Link>
          <button type="button" onClick={close} className="rounded-lg p-2 text-subtle hover:bg-muted lg:hidden" aria-label="Fermer le menu">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-subtle">Pilotage</p>
        <div className="mt-2 flex-1 space-y-6">
          <AdminNav items={items} onNavigate={close} />
          <SiteLink onNavigate={close} />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-muted p-3">
          <div className="flex items-center gap-3">
            <Initials name={user.name} className="size-10 shrink-0 rounded-lg text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-subtle">{user.roleLabel}</p>
            </div>
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setOpenOn(pathname)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-muted lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            <Menu className="size-6" aria-hidden />
          </button>
          <p className="hidden items-center gap-2 text-sm font-semibold text-ink sm:flex">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            Console JENGA Digital
          </p>
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">{topbar}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
