"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      aria-current={isActive(pathname, href) ? "page" : undefined}
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-ink aria-[current=page]:text-brand"
    >
      {label}
    </Link>
  );
}
