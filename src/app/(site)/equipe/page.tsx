import type { Metadata } from "next";
import { CtaBand, EmptyState, TeamCard } from "@/components/site/cards";
import { container, PageHero } from "@/components/site/section";
import { listLive } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Notre équipe",
  description: "Les talents passionnés qui conçoivent vos projets digitaux chez JENGA Digital.",
  alternates: { canonical: "/equipe" },
};

export default async function TeamPage() {
  const team = await listLive("team");
  return (
    <>
      <PageHero eyebrow="Les personnes derrière JENGA" title="Notre équipe" intro="Développeurs, designers et communicants : les talents qui conçoivent et font vivre vos projets." crumbs={[{ href: "/", label: "Accueil" }, { label: "Équipe" }]} />
      <section className={`py-16 sm:py-20 ${container}`}>
        {team.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        ) : (
          <EmptyState title="Notre équipe sera bientôt présentée" text="Nous préparons cette page. En attendant, écrivez-nous : nous serons ravis d'échanger avec vous." />
        )}
      </section>
      <CtaBand chip="Talents bienvenus" title="Envie de construire avec nous ?" text="Nous sommes toujours à la recherche de talents passionnés." label="Nous contacter" />
    </>
  );
}
