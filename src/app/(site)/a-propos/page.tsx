import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, TeamCard, TestimonialCard } from "@/components/site/cards";
import { PageHero, SectionHeading } from "@/components/site/section";
import { fr } from "@/lib/content/public";
import { getHome, listLive } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez JENGA Digital, son histoire, son équipe et sa façon de construire des projets digitaux solides.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  { title: "Écoute", text: "Nous partons de vos objectifs et de vos clients, pas de la technique." },
  { title: "Qualité", text: "Un travail soigné, testé et documenté, fait pour durer." },
  { title: "Transparence", text: "Des devis clairs, des délais tenus et un contact direct." },
  { title: "Innovation", text: "Les bonnes technologies au service de votre croissance." },
];

export default async function AboutPage() {
  const [home, history, team, testimonials] = await Promise.all([getHome(), listLive("history"), listLive("team"), listLive("testimonials")]);
  const steps = [...history].sort((a, b) => a.year - b.year);

  return (
    <>
      <PageHero eyebrow="À propos" title="Une agence digitale qui construit avec vous" intro="Jenga signifie « construire ». Nous bâtissons des outils digitaux solides, brique après brique, aux côtés de nos clients." />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Qui sommes-nous" title="JENGA Digital" />
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {fr(home.about) ||
              "Nous accompagnons les entreprises, les indépendants et les organisations dans leur transformation digitale : création de sites web et d'applications, référencement, marketing digital et identité visuelle. Notre objectif est simple : des outils utiles, beaux et faciles à faire vivre."}
          </p>
        </div>
        <div className="flex items-center justify-center rounded-3xl bg-muted p-10">
          <Image src="/brand/logo-jenga-digital-transparent.png" alt="Logo JENGA Digital" width={640} height={276} className="h-auto w-full max-w-md" />
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Nos valeurs" title="Ce qui guide notre travail" center />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} className="rounded-2xl bg-background p-6 shadow-sm">
                <h3 className="text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {steps.length > 0 ? (
        <section id="histoire" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Notre histoire" title="Les grandes étapes de JENGA Digital" center />
          <ol className="relative mt-12 space-y-10 border-l-2 border-accent-light pl-8">
            {steps.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-background bg-accent" aria-hidden />
                <p className="text-sm font-bold text-brand-mid">{s.date || s.year}</p>
                <h3 className="mt-1 text-xl font-bold text-ink">{fr(s.title)}</h3>
                {fr(s.description) ? <p className="mt-2 whitespace-pre-line text-muted-foreground">{fr(s.description)}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {team.length > 0 ? (
        <section id="equipe" className="bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="Notre équipe" title="Les personnes derrière vos projets" center />
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section id="temoignages" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Témoignages" title="Ce que disent nos clients" center />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
