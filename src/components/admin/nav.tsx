"use client";

import { LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: "dashboard" | "settings" | "users" };

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  settings: Settings,
  users: Users,
};

export function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Administration">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-brand/10 font-medium text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
