import { ArrowRight, ChevronDown, Handshake, Layers, PlayCircle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { btnOutline, btnPrimary, card, CtaBand, ProjectCard, ServiceCard, StepCard, TestimonialCard, textLink } from "@/components/site/cards";
import { RotatingWords } from "@/components/site/hero-motion";
import { Chip, container, SectionHeading } from "@/components/site/section";
import { fr, getPublicFaqs, getPublicServices } from "@/lib/content/public";
import { getHome, listLive } from "@/lib/content/repository";
import { METHOD } from "@/lib/content/method";
import { getSiteSettings } from "@/lib/settings/server";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  return {
    title: { absolute: home.seo.title || `${settings.agencyName} | Agence digitale` },
    description: home.seo.description || fr(home.hero.subtitle) || settings.tagline || undefined,
    alternates: { canonical: "/" },
  };
}

const TRUST = [
  { icon: Layers, label: "Solutions sur mesure" },
  { icon: Handshake, label: "Accompagnement de A à Z" },
  { icon: ShieldCheck, label: "Maintenance et sécurité" },
];

/** Ce que JENGA construit : les mots qui défilent dans le titre. */
const ROTATING = ["site web", "application mobile", "identité visuelle", "présence en ligne"];

/** Titre de l'accueil : ses deux derniers mots en bleu, qui alternent avec nos métiers. */
function HeroTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 4) return <>{text}</>;
  const tail = words.slice(-2).join(" ");
  return (
    <>
      {words.slice(0, -2).join(" ")}{" "}
      <span className="block">
        <RotatingWords
          words={[tail, ...ROTATING.filter((w) => w !== tail)]}
          className="text-brand"
          decoration={
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden className="absolute -bottom-2 left-0 h-2.5 w-full text-brand/40 sm:-bottom-3 sm:h-3">
              <path d="M2 9 C 80 2, 220 2, 298 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          }
        />
      </span>
    </>
  );
}

export default async function HomePage() {
  const [home, settings, services, projects, testimonials, faqs] = await Promise.all([
    getHome(),
    getSiteSettings(),
    getPublicServices(),
    listLive("projects"),
    listLive("testimonials"),
    getPublicFaqs(),
  ]);
  const visible = (key: string) => home.sections.find((s) => s.key === key)?.visible ?? true;
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const serviceName = new Map(services.map((s) => [s.id, fr(s.title)]));

  return (
    <>
      {/* En-tête : centré, il occupe le premier écran et invite à faire défiler. */}
      <section className="hero-glow relative overflow-hidden">
        <div className="tech-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
        {/* Filigrane : l'emblème JENGA, très pâle, derrière le titre. */}
        <Image
          src="/brand/mark-transparent.png"
          alt=""
          aria-hidden
          width={256}
          height={256}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[26rem] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.05] sm:w-[38rem]"
        />
        <div className={`relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center pb-24 pt-12 text-center lg:min-h-[calc(100svh-4.5rem)] ${container}`}>
          <div className="flex max-w-4xl animate-rise flex-col items-center">
            <Chip>Agence digitale & technologies</Chip>
            <h1 className="mt-7 font-hero! text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[4rem]">
              <HeroTitle text={fr(home.hero.title)} />
            </h1>
            {fr(home.hero.subtitle) ? <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">{fr(home.hero.subtitle)}</p> : null}
            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/contact" className={btnPrimary}>
                Démarrer votre projet <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={home.hero.ctaHref || "/realisations"} className={btnOutline}>
                <PlayCircle className="size-4 text-brand" aria-hidden /> {fr(home.hero.ctaLabel) || "Découvrir nos réalisations"}
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <Icon className="size-4 text-brand" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#services"
            aria-label="Voir la suite"
            className="absolute bottom-6 left-1/2 inline-flex size-11 -translate-x-1/2 items-center justify-center rounded-full bg-white text-brand shadow-[var(--shadow-card)] ring-1 ring-border transition hover:text-ink"
          >
            <ChevronDown className="size-5 animate-bounce motion-reduce:animate-none" aria-hidden />
          </a>
        </div>
      </section>

      {visible("services") ? (
        <section id="services" className={`scroll-mt-16 py-20 sm:py-28 ${container}`}>
          <SectionHeading
            eyebrow="Expertise & savoir-faire"
            title="Des briques solides pour chaque besoin digital"
            intro="Du site web à l'application mobile, de l'identité visuelle à la maintenance : chaque service est pensé pour durer."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      ) : null}

      {visible("projects") && featured.length > 0 ? (
        <section className={`py-20 sm:py-28 ${container}`}>
          <SectionHeading
            eyebrow="Études de cas"
            title="Nos réalisations"
            action={
              <Link href="/realisations" className={textLink}>
                Voir toutes nos réalisations <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} tag={p.serviceIds.map((id) => serviceName.get(id)).find(Boolean)} />
            ))}
          </div>
        </section>
      ) : null}

      {visible("about") ? (
        <section className={featured.length > 0 && visible("projects") ? "bg-muted" : ""}>
          <div className={`py-20 sm:py-28 ${container}`}>
            <SectionHeading center eyebrow="Notre méthode" title="Un projet mené en 4 temps" intro="Un cadre simple et transparent, pour avancer sans mauvaise surprise." />
            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {METHOD.map((m, i) => (
                <li key={m.title}>
                  <StepCard index={i} title={m.title} text={m.text} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {visible("testimonials") && testimonials.length > 0 ? (
        <section className="bg-muted">
          <div className={`py-20 sm:py-28 ${container}`}>
            <SectionHeading center eyebrow="Ils nous font confiance" title="Ce que disent nos clients" />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visible("faq") && faqs.length > 0 ? (
        <section className={`py-20 sm:py-28 ${container}`}>
          <SectionHeading center eyebrow="Questions fréquentes" title="Foire aux questions" />
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.slice(0, 4).map((f) => (
              <details key={f.id} className={`group ${card} open:shadow-[var(--shadow-lift)]`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {fr(f.question)}
                  <ChevronDown className="size-5 shrink-0 text-brand transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="whitespace-pre-line px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">{fr(f.answer)}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/faq" className={textLink}>
              Toutes les questions <ArrowRight className="size-4" aria-hidden />
            </Link>
          </p>
        </section>
      ) : null}

      {visible("cta") ? (
        <CtaBand
          chip="Nouveaux projets bienvenus"
          title="Prêt à donner vie à votre prochain projet digital ?"
          secondary={settings.email ? { href: `mailto:${settings.email}`, label: "Nous écrire par e-mail" } : undefined}
        />
      ) : null}
    </>
  );
}
