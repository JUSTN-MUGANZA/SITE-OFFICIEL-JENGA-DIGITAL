import { ArrowRight, Check, Eye, Gem, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { card, CtaBand, StatCard, TeamGrid, textLink } from "@/components/site/cards";
import { container, Eyebrow, PageHero, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { MediaFrame } from "@/components/site/visuals";
import { fr, getPublicServices, getPublicTeam } from "@/lib/content/public";
import { getHome } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "À propos",
  description: "JENGA Digital, agence digitale : notre mission, notre vision et nos valeurs.",
  alternates: { canonical: "/a-propos" },
};

const DEFAULT_ABOUT =
  "JENGA Digital est une agence digitale spécialisée dans la création de solutions numériques. Nous accompagnons les entreprises, les organisations et les particuliers dans leur transformation digitale.\n\n« Jenga » veut dire « construire » : comprendre votre activité, poser des bases solides et faire évoluer vos outils digitaux avec vous.";

const VALUES = [
  { title: "Innovation", text: "des solutions modernes, adaptées à votre réalité." },
  { title: "Professionnalisme", text: "des engagements clairs et tenus." },
  { title: "Créativité", text: "des interfaces qui marquent les esprits." },
  { title: "Collaboration", text: "votre projet se construit avec vous." },
];

export default async function AboutPage() {
  const [home, services, team] = await Promise.all([getHome(), getPublicServices(), getPublicTeam()]);
  const about = (fr(home.about) || DEFAULT_ABOUT).split(/\n{2,}/);

  return (
    <>
      <PageHero
        eyebrow="Notre mission & vision"
        title="Construire votre réussite numérique, brique après brique."
        intro={about[0]}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "À propos" }]}
      >
        <div className={`mt-12 grid items-center gap-8 p-5 sm:p-6 md:grid-cols-2 lg:max-w-4xl ${card}`}>
          <MediaFrame src={home.hero.image} alt="" sizes="(min-width: 768px) 28rem, 100vw" className="aspect-[16/9] rounded-xl">
            <Image src="/brand/logo-jenga-digital-transparent.png" alt="" width={640} height={276} className="h-14 w-auto sm:h-16 dark:hidden" />
            <Image src="/brand/logo-jenga-digital-white.png" alt="" width={720} height={310} className="hidden h-14 w-auto sm:h-16 dark:block" />
          </MediaFrame>
          <div>
            <Eyebrow>Pourquoi « Jenga » ?</Eyebrow>
            <h2 className="mt-2 text-xl font-bold text-ink">Un nom qui veut dire « construire »</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {(about.slice(1).length > 0 ? about.slice(1) : [DEFAULT_ABOUT.split(/\n{2,}/)[1]]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        {home.stats.length > 0 ? (
          <dl className="mt-6 grid grid-cols-2 gap-4 lg:max-w-4xl lg:grid-cols-4">
            {home.stats.map((s, i) => (
              <div key={i}>
                <dt className="sr-only">{fr(s.label)}</dt>
                <dd>
                  <StatCard label={fr(s.label)} value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </PageHero>

      <section className="bg-muted">
        <div className={`py-20 sm:py-24 ${container}`}>
          <SectionHeading
            eyebrow="Ce qui nous guide"
            title="Mission, vision & valeurs"
            intro="Nous préférons l'essentiel au superflu : chaque outil que nous livrons doit servir votre activité."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <article className={`flex flex-col p-7 ${card}`}>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Target className="size-5" aria-hidden />
              </span>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Impact</p>
              <h3 className="mt-1 text-xl font-bold text-ink">Notre mission</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Accompagner nos clients dans leur transformation digitale avec des solutions innovantes, adaptées et durables.
              </p>
            </article>
            <article className={`flex flex-col p-7 ${card}`}>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Eye className="size-5" aria-hidden />
              </span>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Horizon</p>
              <h3 className="mt-1 text-xl font-bold text-ink">Notre vision</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Devenir une référence en Afrique centrale dans les solutions digitales et l&apos;innovation technologique.
              </p>
            </article>
            <article className={`flex flex-col p-7 ${card}`}>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Gem className="size-5" aria-hidden />
              </span>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Exigence</p>
              <h3 className="mt-1 text-xl font-bold text-ink">Nos valeurs</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                {VALUES.map((v) => (
                  <li key={v.title} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <span>
                      <strong className="font-semibold text-ink">{v.title} :</strong> {v.text}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className={`py-20 sm:py-24 ${container}`}>
          <SectionHeading
            eyebrow="Notre savoir-faire"
            title="Ce que nous faisons pour vous"
            action={
              <Link href="/services" className={textLink}>
                Tous nos services <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`flex h-full flex-col items-start gap-4 p-5 text-sm font-semibold text-ink transition hover:-translate-y-1 hover:border-brand/30 hover:text-brand ${card}`}
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <ServiceIcon name={s.icon} className="size-5" />
                  </span>
                  {fr(s.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 ? (
        <section className={`py-20 sm:py-24 ${container}`}>
          <SectionHeading
            center={team.length < 4}
            eyebrow="Notre équipe"
            title="Les personnes derrière vos projets"
            action={
              <Link href="/equipe" className={textLink}>
                Toute l&apos;équipe <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <TeamGrid team={team.slice(0, 4)} className="mt-10" />
        </section>
      ) : null}

      <CtaBand chip="Prochaine étape" title="Construisons ensemble votre prochain projet digital" />
    </>
  );
}
