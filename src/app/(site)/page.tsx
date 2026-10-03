import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { btnOutline, btnOutlineLight, btnPrimary, CtaBand, ProjectCard, ServiceCard, TeamCard, TestimonialCard } from "@/components/site/cards";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/footer";
import { container, Eyebrow, SectionHeading } from "@/components/site/section";
import { DeviceShowcase, MediaFrame, TechLines } from "@/components/site/visuals";
import { fr, getPublicServices } from "@/lib/content/public";
import { getHome, listLive } from "@/lib/content/repository";
import { SOCIAL_NETWORKS } from "@/lib/settings/schema";
import { getSiteSettings } from "@/lib/settings/server";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  return {
    title: { absolute: home.seo.title || `${settings.agencyName} | Agence digitale` },
    description: home.seo.description || fr(home.hero.subtitle) || settings.tagline || undefined,
    alternates: { canonical: "/" },
  };
}

const STAT_ICONS = [BriefcaseBusiness, Users, Award, BadgeCheck];

const STRENGTHS = [
  { icon: Award, title: "Expertise", text: "Une équipe qualifiée et passionnée." },
  { icon: Lightbulb, title: "Créativité", text: "Des solutions innovantes et sur mesure." },
  { icon: ShieldCheck, title: "Fiabilité", text: "Le respect des délais et de la qualité." },
  { icon: HeartHandshake, title: "Accompagnement", text: "Un suivi personnalisé à chaque étape." },
];

/** Met en bleu électrique les deux derniers mots du titre, comme sur la maquette. */
function HighlightedTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 4) return <>{text}</>;
  const tail = words.slice(-2).join(" ");
  return (
    <>
      {words.slice(0, -2).join(" ")} <span className="text-gradient">{tail}</span>
    </>
  );
}

export default async function HomePage() {
  const [home, settings, services, projects, testimonials, team] = await Promise.all([
    getHome(),
    getSiteSettings(),
    getPublicServices(),
    listLive("projects"),
    listLive("testimonials"),
    listLive("team"),
  ]);
  const visible = (key: string) => home.sections.find((s) => s.key === key)?.visible ?? true;
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 4);
  const serviceName = new Map(services.map((s) => [s.id, fr(s.title)]));
  const yearsStat = home.stats.find((s) => /ann/i.test(fr(s.label)));

  return (
    <>
      {/* En-tête */}
      <section className="navy-surface relative overflow-hidden text-white">
        <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
        {home.hero.image ? (
          <div className="absolute inset-0" aria-hidden>
            <Image src={home.hero.image} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/20" />
          </div>
        ) : null}
        <div className={`relative grid items-center gap-14 pb-28 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:pb-36 ${container}`}>
          <div className="animate-rise">
            <Eyebrow light>Agence digitale</Eyebrow>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              <HighlightedTitle text={fr(home.hero.title)} />
            </h1>
            {fr(home.hero.subtitle) ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{fr(home.hero.subtitle)}</p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={home.hero.ctaHref || "/services"} className={btnPrimary}>
                {fr(home.hero.ctaLabel) || "Découvrir nos services"} <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/realisations" className={btnOutlineLight}>
                Voir nos projets
              </Link>
            </div>
          </div>
          {home.hero.image ? null : (
            <div className="hidden sm:block">
              <DeviceShowcase />
            </div>
          )}
        </div>
      </section>

      {/* Chiffres clés */}
      {home.stats.length > 0 ? (
        <section aria-label="Chiffres clés" className={`relative z-10 -mt-16 ${container}`}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-xl shadow-navy-950/10 lg:grid-cols-4">
            {home.stats.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <div key={i} className="flex items-center gap-4 bg-white px-5 py-6 sm:px-7">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <dd className="text-2xl font-bold text-ink sm:text-3xl">{s.value}</dd>
                    <dt className="text-xs text-muted-foreground sm:text-sm">{fr(s.label)}</dt>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}

      {visible("services") ? (
        <section className={`py-20 sm:py-24 ${container}`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Nos services"
              title="Nos domaines d'expertise"
              intro="Nous mettons notre savoir-faire au service de vos ambitions digitales."
            />
            <Link href="/services" className={btnOutline}>
              Voir tous les services <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      ) : null}

      {visible("about") ? (
        <>
          <section className="navy-surface relative overflow-hidden text-white">
            <TechLines className="absolute -left-20 top-0 h-full opacity-30" />
            <div className={`relative grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 ${container}`}>
              <MediaFrame
                src={home.hero.image}
                alt=""
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/3] rounded-3xl shadow-2xl ring-1 ring-white/10"
              >
                <div className="text-center">
                  <Image
                    src="/brand/logo-jenga-digital-white.png"
                    alt=""
                    width={720}
                    height={310}
                    className="mx-auto h-20 w-auto drop-shadow-[0_0_30px_rgba(61,155,255,0.5)] sm:h-24"
                  />
                  <p className="mt-5 text-sm font-medium text-white/70">Construire votre réussite, brique après brique</p>
                </div>
              </MediaFrame>
              <div>
                <Eyebrow light>À propos de nous</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Une agence digitale née d&apos;une même vision</h2>
                <p className="mt-5 leading-relaxed text-white/75">
                  {fr(home.about) ||
                    "JENGA Digital est une agence passionnée par la technologie et l'innovation. Nous aidons les entreprises, les organisations et les particuliers à se transformer grâce aux outils numériques. « Jenga » veut dire « construire » : c'est notre façon de travailler."}
                </p>
                {home.stats.length > 0 ? (
                  <dl className="mt-8 grid grid-cols-3 divide-x divide-white/15">
                    {[home.stats[0], yearsStat ?? home.stats[2], home.stats[3] ?? home.stats[1]].filter(Boolean).map((s, i) => (
                      <div key={i} className="px-4 first:pl-0">
                        <dd className="text-2xl font-bold sm:text-3xl">{s.value}</dd>
                        <dt className="mt-1 text-xs text-white/65 sm:text-sm">{fr(s.label)}</dt>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <Link href="/a-propos" className={`${btnPrimary} mt-9`}>
                  En savoir plus <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          <section className={`grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_1fr] ${container}`}>
            <div>
              <SectionHeading
                eyebrow="Pourquoi nous choisir"
                title="Pourquoi JENGA Digital ?"
                intro="Des solutions digitales adaptées à vos besoins, avec une équipe qui s'engage à vos côtés."
              />
              <ul className="mt-10 grid gap-5 sm:grid-cols-2">
                {STRENGTHS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-brand-soft to-white p-6 sm:p-10">
              <DeviceShowcase />
            </div>
          </section>
        </>
      ) : null}

      {visible("projects") && featured.length > 0 ? (
        <section className="bg-muted">
          <div className={`py-20 sm:py-24 ${container}`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Nos projets"
                title="Quelques réalisations"
                intro="Découvrez quelques projets sur lesquels nous avons travaillé avec passion."
              />
              <Link href="/realisations" className={btnOutline}>
                Voir tous les projets <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} tag={p.serviceIds.map((id) => serviceName.get(id)).find(Boolean)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visible("team") && team.length > 0 ? (
        <section className={`py-20 sm:py-24 ${container}`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Notre équipe"
              title="Des talents engagés à vos côtés"
              intro="Une équipe jeune, dynamique et passionnée par le digital."
            />
            <Link href="/equipe" className={btnOutline}>
              Toute l&apos;équipe <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      ) : null}

      {visible("testimonials") && testimonials.length > 0 ? (
        <section className="navy-surface relative overflow-hidden">
          <div className="tech-grid absolute inset-0 opacity-40" aria-hidden />
          <div className={`relative py-20 sm:py-24 ${container}`}>
            <SectionHeading
              light
              eyebrow="Témoignages"
              title="Ce que nos clients disent"
              intro="La satisfaction de nos clients est notre plus grande réussite."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visible("cta") ? (
        <>
          <section className={`grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.3fr] ${container}`}>
            <div>
              <SectionHeading
                eyebrow="Contact"
                title="Parlons de votre projet"
                intro="Vous avez une idée ? Un besoin ? Une question ? Notre équipe est là pour vous accompagner."
              />
              <ul className="mt-8 space-y-5">
                {[
                  { icon: MapPin, label: "Adresse", value: settings.address },
                  { icon: Phone, label: "Téléphone / WhatsApp", value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, "")}` },
                  { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
                  { icon: Clock3, label: "Horaires", value: settings.hours },
                ]
                  .filter((c) => c.value)
                  .map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{label}</p>
                        {href ? (
                          <a href={href} className="break-all text-sm text-muted-foreground hover:text-brand">
                            {value}
                          </a>
                        ) : (
                          <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                {SOCIAL_NETWORKS.some((n) => settings.socials[n]) ? (
                  <li className="flex gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
                      <Share2 className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">Réseaux sociaux</p>
                      <SocialLinks settings={settings} className="mt-2" />
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-navy-950/5 sm:p-8">
              <ContactForm compact services={services.map((s) => ({ id: s.id, title: fr(s.title) }))} />
            </div>
          </section>
          <CtaBand title="Ensemble, construisons votre succès digital !" text="Votre projet mérite les meilleures solutions." />
        </>
      ) : null}
    </>
  );
}
