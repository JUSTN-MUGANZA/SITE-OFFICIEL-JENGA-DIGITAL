import { Check } from "lucide-react";
import type { Metadata } from "next";
import { card, CtaBand, ServiceFeatureCard, StepCard } from "@/components/site/cards";
import { container, PageHero, SectionHeading } from "@/components/site/section";
import { METHOD } from "@/lib/content/method";
import { getPublicServices } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Développement web, applications mobiles, design graphique, communication digitale, maintenance et formation : des solutions digitales sur mesure.",
  alternates: { canonical: "/services" },
};

const PROMISES = ["Un interlocuteur unique du début à la fin", "Un devis clair avant de commencer", "Des démonstrations à chaque étape", "Un suivi après la mise en ligne"];

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <>
      <PageHero
        eyebrow="Solutions & savoir-faire"
        title="Des solutions digitales"
        accent="taillées pour votre activité."
        intro="Sites web, applications, identité visuelle, communication et maintenance : nous concevons et faisons vivre les outils qui font avancer votre organisation."
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Services" }]}
        aside={
          <div className={`p-6 ${card}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Avec chaque service</p>
            <ul className="mt-4 space-y-3">
              {PROMISES.map((p) => (
                <li key={p} className="flex gap-3 text-sm font-medium text-ink">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        }
      />
      <section className={`py-20 sm:py-24 ${container}`}>
        <SectionHeading eyebrow="Nos expertises" title={`${services.length} services, une seule équipe`} intro="Choisissez un service pour voir ce qu'il comprend, ou décrivez-nous votre besoin : nous vous orientons." />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <ServiceFeatureCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>
      <section className="bg-muted">
        <div className={`py-20 sm:py-24 ${container}`}>
          <SectionHeading center eyebrow="Notre méthode" title="Comment nous menons votre projet" intro="Les mêmes 4 étapes, quel que soit le service choisi." />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((m, i) => (
              <li key={m.title}>
                <StepCard index={i} title={m.title} text={m.text} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand chip="Un besoin précis ?" title="Parlons de votre projet" />
    </>
  );
}
