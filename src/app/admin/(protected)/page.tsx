import { ArrowRight, Briefcase, CalendarDays, ExternalLink, Inbox, Mail, Settings, Star, Users, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AreaChart } from "@/components/admin/area-chart";
import { Initials, MediaFrame, TechLines } from "@/components/site/visuals";
import { Alert } from "@/components/ui/alert";
import { can } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { fr } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";
import { ACTION_LABELS, getContactsPerDay, getDashboardCounts, getRecentActivity, getRecentContacts } from "@/lib/dashboard";
import { isEmailConfigured } from "@/lib/email/send";
import { getSiteSettingsFresh } from "@/lib/settings/server";

export const metadata: Metadata = { title: "Tableau de bord" };

const TZ = "Africa/Lubumbashi";
const dateLong = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: TZ });
const timeShort = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: TZ });
const dayShort = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });

const card = "rounded-2xl border border-border bg-white shadow-sm";

function when(date: Date | null, now: Date) {
  if (!date) return "";
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return timeShort.format(date);
  const yesterday = new Date(now.getTime() - 86_400_000);
  return date.toDateString() === yesterday.toDateString() ? "Hier" : dayShort.format(date);
}

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireAdmin();
  const { acces } = await searchParams;
  const now = new Date();
  const [counts, activity, settings, perDay, recent, projects, team, testimonials] = await Promise.all([
    getDashboardCounts(),
    getRecentActivity(6),
    getSiteSettingsFresh(),
    getContactsPerDay(30, now),
    getRecentContacts(4),
    listLive("projects"),
    listLive("team"),
    listLive("testimonials"),
  ]);
  const firstName = (user.name ?? user.email.split("@")[0]).split(" ")[0];
  const recentProjects = [...projects].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 4);
  const lastMonth = perDay.reduce((s, p) => s + p.count, 0);

  const stats = [
    { label: "Projets publiés", value: projects.length, icon: Briefcase, tone: "bg-brand" },
    { label: "Membres de l'équipe", value: team.length, icon: UsersRound, tone: "bg-violet-500" },
    { label: "Contacts reçus", value: counts.contacts, icon: Mail, tone: "bg-emerald-500", note: `+${lastMonth} sur 30 jours` },
    { label: "Témoignages", value: testimonials.length, icon: Star, tone: "bg-amber-400" },
    { label: "Messages non lus", value: counts.unread, icon: Inbox, tone: "bg-sky-500" },
  ];

  const setup = [
    { done: Boolean(settings.contactRecipientEmail), label: "Adresse de réception des messages du formulaire" },
    { done: isEmailConfigured(), label: "Envoi d'emails (clé Resend)" },
    { done: Boolean(settings.phone || settings.address), label: "Téléphone et adresse dans les paramètres" },
    { done: projects.length > 0, label: "Premier projet publié" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {acces === "refuse" ? <Alert tone="error">Votre rôle ne permet pas d&apos;ouvrir cette page.</Alert> : null}

      <section className="navy-surface relative overflow-hidden rounded-3xl px-6 py-7 text-white shadow-xl shadow-navy-950/15 sm:px-8">
        <div className="tech-grid absolute inset-0 opacity-50" aria-hidden />
        <TechLines className="absolute right-40 top-0 h-full opacity-40" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <Image src="/brand/logo-jenga-digital-white.png" alt="" width={720} height={310} className="hidden h-16 w-auto border-r border-white/15 pr-8 md:block" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">Bonjour {firstName} 👋</h1>
            <p className="mt-1 text-white/75">Voilà un aperçu de l&apos;activité de votre site.</p>
          </div>
          <p className="flex items-start gap-3 text-sm">
            <CalendarDays className="size-5 text-accent" aria-hidden />
            <span>
              <span className="block font-medium capitalize">{dateLong.format(now)}</span>
              <span className="block text-lg font-semibold">{timeShort.format(now)}</span>
            </span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, tone, note }) => (
          <div key={label} className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5`}>
            <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${tone}`}>
              <Icon className="size-6" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-ink">{value}</p>
              {note ? <p className="mt-1 text-xs font-medium text-emerald-600">{note}</p> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className={`${card} p-6`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-ink">
              Nouveaux contacts <span className="text-sm font-normal text-muted-foreground">(30 derniers jours)</span>
            </h2>
            <p className="text-sm text-muted-foreground">{lastMonth} au total</p>
          </div>
          <div className="mt-5">
            <AreaChart points={perDay} label="Nouveaux contacts sur 30 jours" />
          </div>
        </section>

        <section className={`${card} p-6`}>
          <h2 className="text-lg font-semibold text-ink">Messages récents</h2>
          {recent.length === 0 ? (
            <p className="mt-6 rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Aucun message pour le moment. Ils apparaîtront ici dès qu&apos;un visiteur remplit le formulaire.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recent.map((m) => (
                <li key={m.id} className="flex gap-3 py-4">
                  <Initials name={m.name} className="size-11 shrink-0 rounded-full text-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <a href={`mailto:${m.email}`} className="truncate font-semibold text-ink hover:text-brand">
                        {m.name}
                      </a>
                      <span className="shrink-0 text-xs text-muted-foreground">{when(m.at, now)}</span>
                    </div>
                    <p className="truncate text-sm font-medium text-brand">{m.subject}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-muted-foreground">{m.preview}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${m.unread ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`}>
                        {m.unread ? "Non lu" : "Lu"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className={`${card} p-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Projets récents</h2>
            <a href="/realisations" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Voir sur le site <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
          {recentProjects.length === 0 ? (
            <p className="mt-6 rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Aucun projet publié pour le moment.</p>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentProjects.map((p) => (
                <li key={p.id} className="overflow-hidden rounded-xl border border-border">
                  <MediaFrame src={p.coverImage} alt="" sizes="12rem" className="aspect-[16/10]" />
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-ink">{fr(p.title)}</p>
                    {p.updatedAt ? <p className="mt-1 text-xs text-muted-foreground">{dayShort.format(new Date(p.updatedAt))}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} p-6`}>
          <h2 className="text-lg font-semibold text-ink">{can(user.role, "settings:edit") ? "Mise en route" : "Activité récente"}</h2>
          {can(user.role, "settings:edit") ? (
            <ul className="mt-4 space-y-3 text-sm">
              {setup.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${item.done ? "bg-emerald-500 text-white" : "border border-border"}`}
                  >
                    {item.done ? "✓" : ""}
                  </span>
                  <span className={item.done ? "text-ink" : "text-muted-foreground"}>
                    {item.label}
                    <span className="sr-only">{item.done ? " : fait" : " : à faire"}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {activity.length > 0 ? (
            <>
              {can(user.role, "settings:edit") ? <h3 className="mt-6 text-sm font-semibold text-ink">Activité récente</h3> : null}
              <ul className="mt-3 divide-y divide-border text-sm">
                {activity.map((a) => (
                  <li key={a.id} className="py-2.5">
                    <span className="font-medium">{a.userEmail}</span> {ACTION_LABELS[a.action] ?? a.action}
                    {a.createdAt ? <span className="block text-xs text-muted-foreground">{dateTime.format(a.createdAt)}</span> : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      <section className={`${card} grid gap-3 p-4 sm:grid-cols-3`}>
        {can(user.role, "settings:edit") ? (
          <Link href="/admin/parametres" className="flex items-center gap-3 rounded-xl bg-brand px-5 py-4 font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-mid">
            <Settings className="size-5" aria-hidden /> Paramètres du site
          </Link>
        ) : null}
        {can(user.role, "users:manage") ? (
          <Link href="/admin/utilisateurs" className="flex items-center gap-3 rounded-xl border border-border px-5 py-4 font-medium text-ink transition hover:border-brand/40 hover:bg-brand-soft/40">
            <Users className="size-5 text-brand" aria-hidden /> Gérer les utilisateurs
          </Link>
        ) : null}
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl border border-border px-5 py-4 font-medium text-ink transition hover:border-brand/40 hover:bg-brand-soft/40">
          <ExternalLink className="size-5 text-brand" aria-hidden /> Voir le site
        </a>
      </section>
    </div>
  );
}
