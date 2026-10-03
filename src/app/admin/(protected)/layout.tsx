import Link from "next/link";
import { AdminNav, type NavItem } from "@/components/admin/nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ROLE_LABELS, can } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/settings/server";

export default async function ProtectedLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const settings = await getSiteSettings();

  const items: NavItem[] = [{ href: "/admin", label: "Tableau de bord", icon: "dashboard" }];
  if (can(user.role, "settings:edit")) items.push({ href: "/admin/parametres", label: "Paramètres du site", icon: "settings" });
  if (can(user.role, "users:manage")) items.push({ href: "/admin/utilisateurs", label: "Utilisateurs", icon: "users" });

  return (
    <div className="flex flex-1 flex-col bg-muted md:flex-row">
      <aside className="flex flex-col gap-4 border-b border-border bg-background p-4 md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-b-0">
        <Link href="/admin" className="px-3 text-lg font-semibold">
          {settings.agencyName}
        </Link>
        <AdminNav items={items} />
        <div className="mt-auto hidden border-t border-border pt-4 md:block">
          <p className="truncate px-3 text-sm font-medium">{user.name ?? user.email}</p>
          <p className="px-3 text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
        <div className="mt-8 md:hidden">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
