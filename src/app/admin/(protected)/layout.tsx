import { Bell, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import type { NavItem } from "@/components/admin/nav";
import { Initials } from "@/components/site/visuals";
import { ROLE_LABELS, can } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { countUnreadNotifications } from "@/lib/dashboard";

export default async function ProtectedLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const unread = await countUnreadNotifications(user.uid);
  const name = user.name ?? user.email.split("@")[0];

  const items: NavItem[] = [{ href: "/admin", label: "Tableau de bord", icon: "dashboard" }];
  if (can(user.role, "settings:edit")) items.push({ href: "/admin/parametres", label: "Paramètres", icon: "settings" });
  if (can(user.role, "users:manage")) items.push({ href: "/admin/utilisateurs", label: "Utilisateurs", icon: "users" });

  const topbar = (
    <>
      <a href="/" target="_blank" rel="noopener" className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-card)] transition hover:border-brand/40 hover:text-brand md:inline-flex">
        <ExternalLink className="size-4" aria-hidden /> Voir le site
      </a>
      <span className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border bg-white text-ink" title="Notifications">
        <Bell className="size-5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[0.65rem] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
        <span className="sr-only">{unread} notification(s) non lue(s)</span>
      </span>
      <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
        <Initials name={name} className="size-9 rounded-full text-sm" />
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-subtle">{ROLE_LABELS[user.role]}</p>
        </div>
      </div>
    </>
  );

  return (
    <AdminShell items={items} user={{ name, roleLabel: ROLE_LABELS[user.role] }} topbar={topbar}>
      {children}
    </AdminShell>
  );
}
