import { ArrowRight, ChevronDown, Handshake, Layers, PlayCircle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { btnOutline, btnPrimary, card, CtaBand, ProjectCard, ServiceCard, StatCard, StepCard, TeamGrid, TestimonialCard, textLink } from "@/components/site/cards";
import { HeroSlideshow, RotatingWords } from "@/components/site/hero-motion";
import { Chip, container, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { ProjectConsole } from "@/components/site/visuals";
import { fr, getPublicFaqs, getPublicServices, getPublicTeam } from "@/lib/content/public";
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

const STRENGTHS = [
  {
    title: "Du sur-mesure, pas du modèle",
    text: "Chaque projet part de votre activité et de vos clients. Nous concevons l'outil qui vous ressemble, pas un gabarit de plus.",
    badge: "bg-brand text-white",
  },
  {
    title: "Une exécution soignée",
    text: "Des interfaces rapides, un code propre et testé, des délais annoncés clairement et tenus.",
    badge: "bg-teal text-white",
  },
  {
    title: "Un partenaire dans la durée",
    text: "Après la mise en ligne, nous restons à vos côtés : maintenance, évolutions et formation de vos équipes.",
    badge: "bg-brand-tint text-brand",
  },
];


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
      {words.slice(0, -2).join(" ")} <RotatingWords words={[tail, ...ROTATING.filter((w) => w !== tail)]} className="text-brand" />
    </>
  );
}

export default async function HomePage() {
  const [home, settings, services, projects, testimonials, team, faqs] = await Promise.all([
    getHome(),
    getSiteSettings(),
    getPublicServices(),
    listLive("projects"),
    listLive("testimonials"),
    getPublicTeam(),
    getPublicFaqs(),
  ]);
  const visible = (key: string) => home.sections.find((s) => s.key === key)?.visible ?? true;
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const serviceName = new Map(services.map((s) => [s.id, fr(s.title)]));
  const heroImages = [home.hero.image, ...home.hero.images].filter(Boolean);

  return (
    <>
      {/* En-tête */}
      <section className="hero-glow relative overflow-hidden">
        <div className="tech-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" aria-hidden />
        <div className={`relative grid items-center gap-16 pb-20 pt-12 sm:pt-16 lg:grid-cols-12 lg:pb-28 lg:pt-20 ${container}`}>
          <div className="animate-rise lg:col-span-7">
            <Chip>Agence digitale & technologies</Chip>
            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.4rem]">
              <HeroTitle text={fr(home.hero.title)} />
            </h1>
            {fr(home.hero.subtitle) ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{fr(home.hero.subtitle)}</p> : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className={btnPrimary}>
                Démarrer votre projet <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={home.hero.ctaHref || "/realisations"} className={btnOutline}>
                <PlayCircle className="size-4 text-brand" aria-hidden /> {fr(home.hero.ctaLabel) || "Découvrir nos réalisations"}
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <Icon className="size-4 text-brand" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            {heroImages.length > 0 ? (
              <HeroSlideshow images={heroImages} />
            ) : (
              <ProjectConsole location="Bukavu, RDC" />
            )}
          </div>
        </div>
      </section>

      {/* Bande des métiers */}
      {services.length > 0 ? (
        <section aria-label="Nos métiers" className="border-y border-border bg-white">
          <div className={`py-7 ${container}`}>
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">Un seul partenaire pour tout votre digital</p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`} className="flex items-center gap-2.5 text-sm font-semibold text-ink/70 transition hover:text-brand">
                    <ServiceIcon name={s.icon} className="size-5 text-brand" />
                    {fr(s.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Chiffres clés */}
      {home.stats.length > 0 ? (
        <section aria-label="Chiffres clés" className="bg-muted">
          <dl className={`grid grid-cols-2 gap-4 py-14 sm:gap-5 lg:grid-cols-4 ${container}`}>
            {home.stats.map((s, i) => (
              <div key={i}>
                <dt className="sr-only">{fr(s.label)}</dt>
                <dd>
                  <StatCard label={fr(s.label)} value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {visible("services") ? (
        <section className={`py-20 sm:py-28 ${container}`}>
          <SectionHeading
            eyebrow="Expertise & savoir-faire"
            title="Des briques solides pour chaque besoin digital"
            intro="Du site web à l'application mobile, de l'identité visuelle à la maintenance : chaque service est pensé pour durer."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      ) : null}

      {visible("about") ? (
        <section className="bg-muted">
          <div className={`py-20 sm:py-28 ${container}`}>
            <SectionHeading
              center
              eyebrow="ADN & valeurs"
              title={`Pourquoi choisir ${settings.agencyName}`}
              intro="« Jenga » veut dire « construire ». Nous posons des bases solides, puis nous faisons grandir vos outils avec vous."
            />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {STRENGTHS.map((s, i) => (
                <article key={s.title} className={`p-7 ${card}`}>
                  <span className={`inline-flex size-10 items-center justify-center rounded-lg font-display text-sm font-bold ${s.badge}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                </article>
              ))}
            </div>
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

      {visible("team") && team.length > 0 ? (
        <section className={`py-20 sm:py-28 ${container}`}>
          <SectionHeading
            center={team.length < 4}
            eyebrow="Notre équipe"
            title="Des talents engagés à vos côtés"
            action={
              <Link href="/equipe" className={textLink}>
                Toute l&apos;équipe <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <TeamGrid team={team.slice(0, 4)} className="mt-12" />
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
