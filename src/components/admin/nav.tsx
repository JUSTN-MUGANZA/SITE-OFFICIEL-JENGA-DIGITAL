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
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              active ? "bg-brand text-white shadow-lg shadow-brand/30" : "text-white/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-5" aria-hidden />
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
    <div className="border-t border-white/10 pt-5">
      <p className="flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest text-accent">
        Site web <ExternalLink className="size-3.5" aria-hidden />
      </p>
      <a
        href="/"
        target="_blank"
        rel="noopener"
        onClick={onNavigate}
        className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="size-5" aria-hidden /> Voir le site
      </a>
    </div>
  );
}
