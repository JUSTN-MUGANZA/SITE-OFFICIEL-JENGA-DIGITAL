import type { Metadata } from "next";
import Link from "next/link";
import { card, CtaBand, EmptyState, ProjectCard, StepCard } from "@/components/site/cards";
import { container, PageHero, SectionHeading } from "@/components/site/section";
import { METHOD } from "@/lib/content/method";
import { fr, getPublicServices } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description: "Sites web, applications et projets digitaux réalisés par JENGA Digital pour ses clients.",
  alternates: { canonical: "/realisations" },
};

export default async function ProjectsPage({ searchParams }: PageProps<"/realisations">) {
  const [{ categorie }, projects, services] = await Promise.all([searchParams, listLive("projects"), getPublicServices()]);
  const used = services.filter((s) => projects.some((p) => p.serviceIds.includes(s.id)));
  const active = used.find((s) => s.slug === categorie);
  const shown = active ? projects.filter((p) => p.serviceIds.includes(active.id)) : projects;
  const serviceName = new Map(services.map((s) => [s.id, fr(s.title)]));
  const tab = (selected: boolean) =>
    `inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${selected ? "bg-brand text-white shadow-[var(--shadow-electric)]" : "text-muted-foreground hover:bg-muted hover:text-ink"}`;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Nos réalisations."
        accent="Des projets concrets, livrés."
        intro="Une sélection de sites, d'applications et d'identités visuelles que nous avons conçus et réalisés pour nos clients."
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Réalisations" }]}
        aside={
          projects.length > 0 ? (
            <div className={`flex items-center gap-4 p-5 lg:ml-auto lg:w-fit ${card}`}>
              <span className="font-display text-4xl font-extrabold text-brand">{projects.length}</span>
              <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-subtle">
                {projects.length > 1 ? "Projets présentés" : "Projet présenté"}
                <br />
                {used.length > 0 ? `dans ${used.length} ${used.length > 1 ? "domaines" : "domaine"}` : null}
              </span>
            </div>
          ) : null
        }
      />
      <section className={`py-14 sm:py-16 ${container}`}>
        {used.length > 1 ? (
          <nav aria-label="Filtrer par service" className={`mb-10 flex w-fit max-w-full flex-wrap gap-1 p-1.5 ${card}`}>
            <Link href="/realisations" scroll={false} className={tab(!active)} aria-current={!active ? "page" : undefined}>
              Tous les projets
              <span className={`rounded-md px-1.5 text-xs ${!active ? "bg-white/20" : "bg-muted"}`}>{projects.length}</span>
            </Link>
            {used.map((s) => (
              <Link
                key={s.id}
                href={`/realisations?categorie=${s.slug}`}
                scroll={false}
                className={tab(active?.id === s.id)}
                aria-current={active?.id === s.id ? "page" : undefined}
              >
                {fr(s.title)}
              </Link>
            ))}
          </nav>
        ) : null}
        {shown.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProjectCard key={p.id} project={p} tag={p.serviceIds.map((id) => serviceName.get(id)).find(Boolean)} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nos études de cas arrivent bientôt" text="Nous préparons la présentation détaillée de nos projets. En attendant, parlons du vôtre." />
        )}
      </section>
      <section className="bg-muted">
        <div className={`py-20 sm:py-24 ${container}`}>
          <SectionHeading center eyebrow="Notre méthode" title="Comment chaque projet est livré" intro="Pas d'improvisation : un cadre clair, des validations à chaque étape." />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((m, i) => (
              <li key={m.title}>
                <StepCard index={i} title={m.title} text={m.text} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand title="Votre projet sera peut-être le prochain ici" label="Estimer mon projet" />
    </>
  );
}
