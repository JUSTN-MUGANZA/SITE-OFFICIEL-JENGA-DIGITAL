import { ArrowRight, Gauge, HeartHandshake, Rocket, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, ProjectCard, ServiceCard, TestimonialCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/site/section";
import { fr, getPublicServices } from "@/lib/content/public";
import { getHome, listLive } from "@/lib/content/repository";
import { getSiteSettings } from "@/lib/settings/server";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  return {
    title: { absolute: home.seo.title || `${settings.agencyName} | Agence digitale` },
    description: home.seo.description || fr(home.hero.subtitle) || settings.tagline || undefined,
    alternates: { canonical: "/" },
  };
}

const STRENGTHS = [
  { icon: Rocket, title: "Des projets livrés vite", text: "Un planning clair et des étapes validées avec vous." },
  { icon: Gauge, title: "Des sites rapides", text: "Performances et référencement pensés dès le départ." },
  { icon: ShieldCheck, title: "Sécurité et fiabilité", text: "Hébergement sécurisé, sauvegardes et mises à jour." },
  { icon: HeartHandshake, title: "Un vrai accompagnement", text: "Conseils, formation et support après la mise en ligne." },
];

export default async function HomePage() {
  const [home, services, projects, testimonials] = await Promise.all([
    getHome(),
    getPublicServices(),
    listLive("projects"),
    listLive("testimonials"),
  ]);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);

  const blocks: Record<string, React.ReactNode> = {
    services: (
      <section key="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Nos services" title="Tout pour réussir votre présence en ligne" intro="De l'idée à la mise en ligne, nous vous accompagnons à chaque étape." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>
    ),
    projects:
      featured.length > 0 ? (
        <section key="projects" className="bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Réalisations" title="Quelques projets récents" />
              <Link href="/realisations" className="inline-flex items-center gap-1 font-semibold text-brand-mid hover:text-brand">
                Voir toutes nos réalisations <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null,
    about: (
      <section key="about" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Pourquoi JENGA Digital" title="Construire votre réussite numérique, brique après brique" />
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {fr(home.about) ||
              "Jenga veut dire « construire ». C'est notre façon de travailler : comprendre votre activité, poser des bases solides et faire évoluer vos outils digitaux avec vous."}
          </p>
          <Link href="/a-propos" className="mt-6 inline-flex items-center gap-1 font-semibold text-brand-mid hover:text-brand">
            Découvrir l&apos;agence <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2">
          {STRENGTHS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-border p-5">
              <Icon className="size-7 text-accent" aria-hidden />
              <h3 className="mt-3 font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    ),
    testimonials:
      testimonials.length > 0 ? (
        <section key="testimonials" className="bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeading eyebrow="Témoignages" title="Ils nous ont fait confiance" center />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null,
    cta: <CtaBand key="cta" />,
  };

  return (
    <>
      <section className="brand-gradient relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-rise">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">Agence digitale</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{fr(home.hero.title)}</h1>
            {fr(home.hero.subtitle) ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{fr(home.hero.subtitle)}</p> : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={home.hero.ctaHref || "/contact"} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand shadow-lg transition hover:bg-accent-light">
                {fr(home.hero.ctaLabel) || "Parlons de votre projet"} <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="/services" className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Nos services
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
            {home.hero.image ? (
              <Image src={home.hero.image} alt="" fill priority sizes="384px" className="rounded-3xl object-cover shadow-2xl" />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[2.5rem] bg-white/95 p-12 shadow-2xl">
                <Image src="/brand/mark-transparent.png" alt="" width={256} height={256} priority className="h-auto w-full" />
              </div>
            )}
          </div>
        </div>
        {home.stats.length > 0 ? (
          <div className="border-t border-white/15">
            <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
              {home.stats.map((s) => (
                <div key={fr(s.label)}>
                  <dt className="text-sm text-white/75">{fr(s.label)}</dt>
                  <dd className="text-3xl font-extrabold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </section>

      {home.sections.filter((s) => s.visible).map((s) => blocks[s.key] ?? null)}
    </>
  );
}
