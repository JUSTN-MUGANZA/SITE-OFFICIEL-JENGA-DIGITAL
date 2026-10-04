import { ArrowRight, Briefcase, Check, ExternalLink, History, Inbox, Mail, Settings, Users, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AreaChart } from "@/components/admin/area-chart";
import { Initials, MediaFrame } from "@/components/site/visuals";
import { buttonClass } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { can, ROLE_LABELS } from "@/lib/auth/roles";
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

const card = "rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]";

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
    { label: "Contacts reçus", value: counts.contacts, icon: Mail, note: `+${lastMonth} sur 30 jours`, tone: "text-success bg-success/10" },
    { label: "Messages non lus", value: counts.unread, icon: Inbox, note: counts.unread > 0 ? "À traiter" : "Tout est lu", tone: counts.unread > 0 ? "text-danger bg-danger/10" : "text-success bg-success/10" },
    { label: "Projets publiés", value: projects.length, icon: Briefcase },
    { label: "Équipe & témoignages", value: team.length + testimonials.length, icon: UsersRound, note: `${team.length} membres · ${testimonials.length} avis` },
  ];

  const setup = [
    { done: Boolean(settings.contactRecipientEmail), label: "Adresse de réception des messages" },
    { done: isEmailConfigured(), label: "Envoi d'e-mails (clé Resend)" },
    { done: Boolean(settings.phone || settings.address), label: "Téléphone et adresse du site" },
    { done: projects.length > 0, label: "Premier projet publié" },
    { done: team.length > 0, label: "Équipe présentée" },
  ];
  const setupDone = setup.filter((s) => s.done).length;
  const setupPct = Math.round((setupDone / setup.length) * 100);
  const canSettings = can(user.role, "settings:edit");

  return (
    <div className="mx-auto max-w-[1320px] space-y-6">
      {acces === "refuse" ? <Alert tone="error">Votre rôle ne permet pas d&apos;ouvrir cette page.</Alert> : null}

      <section className={`${card} hero-glow flex flex-col gap-6 p-6 md:flex-row md:items-center sm:p-7`}>
        <div className="flex flex-1 items-center gap-4">
          <Initials name={user.name ?? firstName} className="size-14 shrink-0 rounded-2xl text-lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">Bonjour, {firstName}</h1>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">{ROLE_LABELS[user.role]}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Voici l&apos;activité de votre site aujourd&apos;hui.</p>
          </div>
        </div>
        <div className="flex items-center gap-6 md:border-l md:border-border md:pl-6">
          <p className="text-sm">
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Bukavu</span>
            <span className="block font-semibold capitalize text-ink">{dateLong.format(now)}</span>
          </p>
          <p className="font-display text-3xl font-extrabold tabular-nums text-ink">{timeShort.format(now)}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, note, tone }) => (
          <div key={label} className={`${card} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">{label}</p>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-[18px]" aria-hidden />
              </span>
            </div>
            <p className="mt-2 font-display text-4xl font-extrabold tabular-nums text-ink">{value}</p>
            {note ? <p className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${tone ?? "bg-muted text-muted-foreground"}`}>{note}</p> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className={`${card} p-6 xl:col-span-8`}>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Formulaire de contact</p>
              <h2 className="mt-1 text-lg font-bold text-ink">Nouveaux contacts sur 30 jours</h2>
            </div>
            <p className="rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold text-ink">{lastMonth} au total</p>
          </div>
          <div className="mt-6 rounded-xl bg-muted/60 p-3">
            <AreaChart points={perDay} label="Nouveaux contacts sur 30 jours" />
          </div>
        </section>

        <section className={`${card} p-6 xl:col-span-4`}>
          {canSettings ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-ink">Mise en route</h2>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                  {setupDone}/{setup.length}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={setupPct} aria-valuemin={0} aria-valuemax={100} aria-label="Mise en route du site">
                <div className="h-full rounded-full bg-brand" style={{ width: `${setupPct}%` }} />
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {setup.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-brand text-white" : "border-2 border-border"}`}
                    >
                      {item.done ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                    <span className={item.done ? "font-medium text-ink" : "text-muted-foreground"}>
                      {item.label}
                      <span className="sr-only">{item.done ? " : fait" : " : à faire"}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/admin/parametres" className={`${buttonClass("secondary")} mt-6 w-full`}>
                <Settings className="size-4" aria-hidden /> Ouvrir les paramètres
              </Link>
            </>
          ) : (
            <ActivityList activity={activity} />
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className={`${card} overflow-hidden xl:col-span-8`}>
          <div className="flex items-center justify-between gap-3 p-6 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Inbox className="size-5 text-brand" aria-hidden /> Demandes de contact récentes
            </h2>
          </div>
          {recent.length === 0 ? (
            <p className="mx-6 mb-6 rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Aucun message pour le moment. Ils apparaîtront ici dès qu&apos;un visiteur remplit le formulaire.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-y border-border bg-muted/60 text-[11px] font-bold uppercase tracking-[0.1em] text-subtle">
                  <tr>
                    <th scope="col" className="px-6 py-3">Contact</th>
                    <th scope="col" className="px-3 py-3">Sujet</th>
                    <th scope="col" className="px-3 py-3">Reçu</th>
                    <th scope="col" className="px-6 py-3 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((m) => (
                    <tr key={m.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Initials name={m.name} className="size-9 shrink-0 rounded-full text-xs" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{m.name}</p>
                            <a href={`mailto:${m.email}`} className="block truncate text-xs text-subtle hover:text-brand">
                              {m.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[16rem] px-3 py-4">
                        <p className="truncate font-medium text-ink">{m.subject}</p>
                        <p className="truncate text-xs text-subtle">{m.preview}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-subtle">{when(m.at, now)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${m.unread ? "bg-brand-soft text-brand" : "bg-muted text-subtle"}`}>
                          <span className={`size-1.5 rounded-full ${m.unread ? "bg-brand" : "bg-subtle"}`} aria-hidden />
                          {m.unread ? "Nouveau" : "Lu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={`${card} p-6 xl:col-span-4`}>
          {canSettings ? <ActivityList activity={activity} /> : <QuickActions canSettings={false} canUsers={can(user.role, "users:manage")} />}
          {canSettings ? (
            <div className="mt-6 border-t border-border pt-6">
              <QuickActions canSettings canUsers={can(user.role, "users:manage")} />
            </div>
          ) : null}
        </section>
      </div>

      <section className={`${card} p-6`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Portfolio</p>
            <h2 className="mt-1 text-lg font-bold text-ink">Dernières réalisations publiées</h2>
          </div>
          <a href="/realisations" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            Voir sur le site <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
        {recentProjects.length === 0 ? (
          <p className="mt-6 rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Aucun projet publié pour le moment.</p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl border border-border">
                <MediaFrame src={p.coverImage} alt="" sizes="16rem" className="aspect-[16/10]" />
                <div className="p-4">
                  <p className="truncate text-sm font-bold text-ink">{fr(p.title)}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{fr(p.summary)}</p>
                  {p.updatedAt ? <p className="mt-2 text-[11px] font-semibold text-subtle">Mis à jour le {dayShort.format(new Date(p.updatedAt))}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ActivityList({ activity }: { activity: Awaited<ReturnType<typeof getRecentActivity>> }) {
  return (
    <>
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <History className="size-5 text-brand" aria-hidden /> Activité récente
      </h2>
      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Aucune action enregistrée pour le moment.</p>
      ) : (
        <ol className="mt-4 space-y-4 text-sm">
          {activity.map((a) => (
            <li key={a.id} className="relative flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" aria-hidden />
              <div className="min-w-0">
                <p className="text-ink">
                  <span className="font-semibold">{a.userEmail}</span> {ACTION_LABELS[a.action] ?? a.action}
                </p>
                {a.createdAt ? <p className="text-xs text-subtle">{dateTime.format(a.createdAt)}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function QuickActions({ canSettings, canUsers }: { canSettings: boolean; canUsers: boolean }) {
  const item = "flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand/40 hover:bg-brand-soft/50";
  return (
    <>
      <h2 className="text-lg font-bold text-ink">Actions rapides</h2>
      <div className="mt-4 grid gap-2.5">
        {canSettings ? (
          <Link href="/admin/parametres" className={item}>
            <Settings className="size-4 text-brand" aria-hidden /> Paramètres du site
          </Link>
        ) : null}
        {canUsers ? (
          <Link href="/admin/utilisateurs" className={item}>
            <Users className="size-4 text-brand" aria-hidden /> Gérer les utilisateurs
          </Link>
        ) : null}
        <a href="/" target="_blank" rel="noopener" className={item}>
          <ExternalLink className="size-4 text-brand" aria-hidden /> Voir le site public
        </a>
      </div>
    </>
  );
}
