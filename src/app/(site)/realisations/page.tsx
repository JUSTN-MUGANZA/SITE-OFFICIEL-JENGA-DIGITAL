import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, ProjectCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/section";
import { listLive } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Sites web, applications et projets digitaux réalisés par JENGA Digital pour ses clients.",
  alternates: { canonical: "/realisations" },
};

export default async function ProjectsPage() {
  const projects = await listLive("projects");
  return (
    <>
      <PageHero eyebrow="Réalisations" title="Nos projets" intro="Une sélection de projets que nous avons conçus et développés pour nos clients." />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border p-10 text-center">
            <h2 className="text-xl font-bold text-ink">Nos réalisations arrivent bientôt</h2>
            <p className="mt-3 text-muted-foreground">Nous préparons la présentation de nos projets. En attendant, parlons du vôtre.</p>
            <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-mid">
              Nous contacter
            </Link>
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
