"use client";

import { Briefcase, ExternalLink, LayoutDashboard, Layers, Mail, MessageSquareQuote, Settings, Star, Users, UsersRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavIcon = "dashboard" | "projects" | "services" | "team" | "testimonials" | "messages" | "settings" | "users" | "faq";
export type NavItem = { href: string; label: string; icon: NavIcon; badge?: number };

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  projects: Briefcase,
  services: Layers,
  team: UsersRound,
  testimonials: Star,
  messages: Mail,
  settings: Settings,
  users: Users,
  faq: MessageSquareQuote,
};

export function AdminNav({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1" aria-label="Administration">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              active ? "bg-brand-soft text-brand" : "text-muted-foreground hover:bg-muted hover:text-ink"
            }`}
          >
            <Icon className="size-[18px]" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.badge ? <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">{item.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-border pt-5">
      <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-subtle">Site public</p>
      <a
        href="/"
        target="_blank"
        rel="noopener"
        onClick={onNavigate}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-ink"
      >
        <ExternalLink className="size-[18px]" aria-hidden /> Voir le site
      </a>
    </div>
  );
}
