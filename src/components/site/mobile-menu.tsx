"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string };

export function MobileMenu({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  // Le menu est ouvert pour une page donnée : il se referme tout seul quand la page change.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((typeof next === "function" ? next(open) : next) ? pathname : null);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-muted"
      >
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
      </button>
      {open ? (
        <nav id="menu-mobile" className="absolute inset-x-0 top-full border-b border-border bg-background px-4 pb-6 shadow-lg animate-rise">
          <ul className="space-y-1 pt-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-muted aria-[current=page]:text-brand-mid"
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
