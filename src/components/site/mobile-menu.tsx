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
        className="inline-flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10"
      >
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
      </button>
      {open ? (
        <nav id="menu-mobile" aria-label="Menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-navy-950 px-4 pb-6 shadow-2xl animate-rise">
          <ul className="space-y-1 pt-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-white/85 hover:bg-white/5 aria-[current=page]:bg-brand/20 aria-[current=page]:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-4 block rounded-full bg-brand px-4 py-3 text-center font-semibold text-white">
            Nous contacter
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
