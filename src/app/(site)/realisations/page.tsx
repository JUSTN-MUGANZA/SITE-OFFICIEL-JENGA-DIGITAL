import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, EmptyState, ProjectCard } from "@/components/site/cards";
import { container, PageHero } from "@/components/site/section";
import { fr, getPublicServices } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Nos projets",
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
    `rounded-full px-4 py-2 text-sm font-medium transition ${selected ? "bg-brand text-white shadow-md shadow-brand/30" : "bg-white text-ink/75 ring-1 ring-border hover:text-brand hover:ring-brand/30"}`;

  return (
    <>
      <PageHero title="Nos projets" intro="Une sélection de projets que nous avons conçus et réalisés pour nos clients." crumbs={[{ href: "/", label: "Accueil" }, { label: "Projets" }]} />
      <section className={`py-16 sm:py-20 ${container}`}>
        {used.length > 1 ? (
          <nav aria-label="Filtrer par service" className="mb-10 flex flex-wrap gap-2">
            <Link href="/realisations" scroll={false} className={tab(!active)} aria-current={!active ? "page" : undefined}>
              Tous
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProjectCard key={p.id} project={p} tag={p.serviceIds.map((id) => serviceName.get(id)).find(Boolean)} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nos réalisations arrivent bientôt" text="Nous préparons la présentation de nos projets. En attendant, parlons du vôtre." />
        )}
      </section>
      <CtaBand />
    </>
  );
}
