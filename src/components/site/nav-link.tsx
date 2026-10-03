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
      className="relative px-2.5 py-2 text-sm font-medium text-white/80 transition after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-brand-mid after:transition hover:text-white aria-[current=page]:text-white aria-[current=page]:after:scale-x-100 xl:px-3"
    >
      {label}
    </Link>
  );
}
