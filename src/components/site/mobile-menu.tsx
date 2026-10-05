"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isActive } from "./nav-link";

type Item = { href: string; label: string };

export function MobileMenu({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  // Le menu est ouvert pour une page donnée : il se referme tout seul quand la page change.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpenOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-muted"
      >
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
      </button>
      {open ? (
        <nav id="menu-mobile" aria-label="Menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-t border-border bg-surface px-4 pb-6 shadow-[var(--shadow-lift)] animate-rise">
          <ul className="space-y-1 pt-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-ink hover:bg-muted aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-4 block rounded-lg bg-brand px-4 py-3 text-center font-semibold text-white">
            Demander un devis
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
