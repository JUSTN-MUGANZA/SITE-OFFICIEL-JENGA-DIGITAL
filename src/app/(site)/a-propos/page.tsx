import { ArrowRight, Check, Eye, Target, Gem } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { btnPrimary, CtaBand } from "@/components/site/cards";
import { container, PageHero, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { MediaFrame, TechLines } from "@/components/site/visuals";
import { fr, getPublicServices } from "@/lib/content/public";
import { getHome } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "À propos",
  description: "JENGA Digital, agence digitale au service de votre réussite : notre mission, notre vision, nos valeurs et notre expertise.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = ["Innovation", "Professionnalisme", "Créativité", "Fiabilité", "Collaboration"];

export default async function AboutPage() {
  const [home, services] = await Promise.all([getHome(), getPublicServices()]);

  return (
    <>
      <PageHero
        title="À propos de JENGA Digital"
        intro="Une agence digitale au service de votre réussite."
        crumbs={[{ href: "/", label: "Accueil" }, { label: "À propos" }]}
      />

      <section className={`grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 ${container}`}>
        <div>
          <SectionHeading eyebrow="Qui sommes-nous ?" title="Construire votre réussite numérique, brique après brique" />
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            {(
              fr(home.about) ||
              "JENGA Digital est une agence digitale spécialisée dans la création de solutions numériques innovantes. Nous accompagnons les entreprises, les organisations et les particuliers dans leur transformation digitale.\n\n« Jenga » veut dire « construire » : comprendre votre activité, poser des bases solides et faire évoluer vos outils digitaux avec vous."
            )
              .split(/\n{2,}/)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
          <Link href="/histoire" className={`${btnPrimary} mt-8`}>
            Découvrir notre histoire <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <MediaFrame src={home.hero.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] rounded-3xl shadow-2xl shadow-navy-950/20">
          <Image src="/brand/logo-jenga-digital-white.png" alt="" width={720} height={310} className="h-20 w-auto drop-shadow-[0_0_30px_rgba(61,155,255,0.5)] sm:h-24" />
        </MediaFrame>
      </section>

      <section className="bg-muted">
        <div className={`grid gap-6 py-20 md:grid-cols-3 ${container}`}>
          <article className="rounded-2xl border border-border bg-white p-7 shadow-sm">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
              <Target className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-ink">Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Accompagner nos clients dans leur transformation digitale en leur offrant des solutions innovantes, adaptées et durables.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-white p-7 shadow-sm">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
              <Eye className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-ink">Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Devenir une référence en Afrique centrale dans les solutions digitales et l&apos;innovation technologique.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-white p-7 shadow-sm">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
              <Gem className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-ink">Valeurs</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {VALUES.map((v) => (
                <li key={v} className="flex items-center gap-2">
                  <Check className="size-4 text-brand" aria-hidden />
                  {v}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${container}`}>
        <SectionHeading eyebrow="Notre expertise" title="Ce que nous faisons pour vous" />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {services.map((s) => (
            <li key={s.id}>
              <Link
                href={`/services/${s.slug}`}
                className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-white px-3 py-6 text-center text-sm font-medium text-ink transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                {fr(s.title)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {home.stats.length > 0 ? (
        <section className="navy-surface relative overflow-hidden text-white">
          <TechLines className="absolute -right-10 top-0 h-full opacity-40" />
          <div className={`relative py-16 ${container}`}>
            <h2 className="text-2xl font-bold sm:text-3xl">Nos chiffres clés</h2>
            <dl className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {home.stats.map((s, i) => (
                <div key={i} className="border-l-2 border-brand pl-5">
                  <dd className="text-4xl font-bold">{s.value}</dd>
                  <dt className="mt-1 text-sm text-white/70">{fr(s.label)}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <CtaBand title="Ensemble, construisons un avenir digital." text="Contactez-nous dès aujourd'hui et donnez vie à vos projets." />
    </>
  );
}
