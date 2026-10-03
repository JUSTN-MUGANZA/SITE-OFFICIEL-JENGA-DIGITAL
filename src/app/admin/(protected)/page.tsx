import { FolderKanban, Inbox, Mail, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { can } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { ACTION_LABELS, getDashboardCounts, getRecentActivity } from "@/lib/dashboard";
import { isEmailConfigured } from "@/lib/email/send";
import { getSiteSettingsFresh } from "@/lib/settings/server";

export const metadata: Metadata = { title: "Tableau de bord" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireAdmin();
  const { acces } = await searchParams;
  const [counts, activity, settings] = await Promise.all([getDashboardCounts(), getRecentActivity(), getSiteSettingsFresh()]);

  const stats = [
    { label: "Projets", value: counts.projects, icon: FolderKanban },
    { label: "Services", value: counts.services, icon: Wrench },
    { label: "Contacts", value: counts.contacts, icon: Mail },
    { label: "Messages non lus", value: counts.unread, icon: Inbox },
  ];

  const setup = [
    { done: Boolean(settings.contactRecipientEmail), label: "Adresse de réception des messages du formulaire" },
    { done: isEmailConfigured(), label: "Envoi d'emails (clé Resend)" },
    { done: Boolean(process.env.NEXT_PUBLIC_SITE_URL), label: "Adresse publique du site (NEXT_PUBLIC_SITE_URL)" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Bonjour{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble du site {settings.agencyName}.</p>
      </header>

      {acces === "refuse" ? <Alert tone="error">Votre rôle ne permet pas d&apos;ouvrir cette page.</Alert> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Icon className="size-5 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Activité récente">
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune activité pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="py-2.5 text-sm">
                  <span className="font-medium">{a.userEmail}</span> {ACTION_LABELS[a.action] ?? a.action}
                  {a.createdAt ? <span className="block text-xs text-muted-foreground">{dateFormat.format(a.createdAt)}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {can(user.role, "settings:edit") ? (
          <Card title="Mise en route" description="Ce qui reste à configurer avant la mise en ligne.">
            <ul className="space-y-2 text-sm">
              {setup.map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  <span aria-hidden className={item.done ? "text-success" : "text-muted-foreground"}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={item.done ? "" : "text-muted-foreground"}>
                    {item.label}
                    <span className="sr-only">{item.done ? " : fait" : " : à faire"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
