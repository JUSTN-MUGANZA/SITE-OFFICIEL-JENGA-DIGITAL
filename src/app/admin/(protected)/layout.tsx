import { Bell } from "lucide-react";
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
      <span className="relative inline-flex size-10 items-center justify-center rounded-xl text-ink" title="Notifications">
        <Bell className="size-5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[0.65rem] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
        <span className="sr-only">{unread} notification(s) non lue(s)</span>
      </span>
      <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
        <Initials name={name} className="size-10 rounded-full text-sm" />
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
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
