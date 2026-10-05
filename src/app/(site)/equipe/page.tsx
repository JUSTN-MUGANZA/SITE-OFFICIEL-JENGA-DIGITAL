import { Code2, Eye, Lightbulb, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { btnOutline, btnPrimary, card, CtaBand, EmptyState, TeamProfileCard } from "@/components/site/cards";
import { Breadcrumbs, Chip, container, SectionHeading } from "@/components/site/section";
import { getPublicTeam } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Notre équipe",
  description: "Les personnes qui conçoivent et développent vos projets digitaux chez JENGA Digital.",
  alternates: { canonical: "/equipe" },
};

const VALUES = [
  {
    icon: Code2,
    title: "Un code propre et durable",
    text: "Un code lisible et testé, pensé pour être maintenu et pour évoluer avec votre activité.",
  },
  {
    icon: Users,
    title: "Pensé pour vos utilisateurs",
    text: "Des interfaces simples, rapides et accessibles, conçues d'abord pour les personnes qui les utiliseront.",
  },
  {
    icon: Eye,
    title: "La transparence",
    text: "Des points d'étape réguliers : vous savez toujours où en est votre projet et ce qui vient ensuite.",
  },
  {
    icon: Lightbulb,
    title: "Apprendre en continu",
    text: "Nous suivons les nouvelles technologies et les bonnes pratiques pour vous proposer des solutions à jour.",
  },
];

export default async function TeamPage() {
  const team = await getPublicTeam();
  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-border/70">
        <div className={`relative pb-16 pt-10 sm:pb-20 sm:pt-14 ${container}`}>
          <Breadcrumbs crumbs={[{ href: "/", label: "Accueil" }, { label: "Équipe" }]} />
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
            <Chip>L&apos;équipe JENGA Digital</Chip>
            <h1 className="mt-5 animate-rise text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.4rem]">
              Les personnes qui construisent vos projets digitaux
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Chez JENGA Digital, vous échangez directement avec celles et ceux qui conçoivent et développent votre projet, du premier appel à la mise en ligne.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#equipe" className={btnPrimary}>
                Découvrir l&apos;équipe
              </a>
              <a href="#rejoindre" className={btnOutline}>
                Nous rejoindre
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="equipe" className="scroll-mt-20 bg-muted py-20 sm:py-24">
        <div className={container}>
          <SectionHeading
            center={team.length < 3}
            eyebrow="Notre équipe"
            title="Les talents derrière JENGA"
            intro="Développement, design et communication : chaque projet est porté par des personnes passionnées par leur métier."
            action={
              team.length > 0 ? (
                <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink/70 ring-1 ring-border">
                  {team.length} {team.length > 1 ? "membres" : "membre"}
                </span>
              ) : undefined
            }
          />
          {team.length > 0 ? (
            <ul className="mt-12 flex flex-wrap justify-center gap-6">
              {team.map((m) => (
                <li key={m.id} className="w-full max-w-md md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                  <TeamProfileCard member={m} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12">
              <EmptyState title="Notre équipe sera bientôt présentée" text="Nous préparons cette page. En attendant, écrivez-nous : nous serons ravis d'échanger avec vous." />
            </div>
          )}
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${container}`}>
        <SectionHeading center eyebrow="Notre façon de travailler" title="Ce qui guide chacun de nos projets" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <article key={v.title} className={`p-6 ${card}`}>
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <v.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="rejoindre" className={`scroll-mt-20 ${container}`}>
        <div className={`flex flex-col gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between ${card}`}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Rejoindre JENGA Digital</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">Envie de construire avec nous ?</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Aucune offre n&apos;est ouverte pour le moment, mais nous aimons rencontrer des développeurs, designers et communicants passionnés. Présentez-vous en quelques lignes.
            </p>
          </div>
          <Link href="/contact" className={`${btnPrimary} shrink-0`}>
            Candidature spontanée
          </Link>
        </div>
      </section>

      <CtaBand
        chip="Échange sans engagement"
        title="Envie d'échanger avec nous avant de lancer votre projet ?"
        text="Présentez-nous votre idée : nous regardons avec vous la faisabilité, les étapes et le budget."
        label="Prendre contact"
        secondary={{ href: "/realisations", label: "Voir nos réalisations" }}
      />
    </>
  );
}
