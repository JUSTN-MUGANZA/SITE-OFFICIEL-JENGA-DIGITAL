import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cards";
import { container, PageHero } from "@/components/site/section";
import { MediaFrame } from "@/components/site/visuals";
import { fr, getPublicHistory } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "Les grandes étapes de JENGA Digital, de sa création à aujourd'hui.",
  alternates: { canonical: "/histoire" },
};

export default async function HistoryPage() {
  const steps = [...(await getPublicHistory())].sort((a, b) => a.year - b.year);
  return (
    <>
      <PageHero
        title="Notre histoire"
        intro="Une aventure humaine et digitale."
        crumbs={[{ href: "/", label: "Accueil" }, { href: "/a-propos", label: "À propos" }, { label: "Notre histoire" }]}
      />
      <section className={`py-20 sm:py-24 ${container}`}>
        <ol className="relative mx-auto max-w-5xl space-y-10 before:absolute before:bottom-4 before:left-[1.1rem] before:top-4 before:w-px before:bg-gradient-to-b before:from-brand before:to-brand/10">
          {steps.map((step) => (
            <li key={step.id} className="relative grid gap-6 pl-14 md:grid-cols-[1fr_16rem] md:items-center">
              <span className="absolute left-0 top-1 inline-flex size-9 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 ring-4 ring-brand-soft" aria-hidden>
                <span className="size-2.5 rounded-full bg-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand">{step.date || step.year}</p>
                <h2 className="mt-1 text-xl font-semibold text-ink">{fr(step.title)}</h2>
                {fr(step.description) ? <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{fr(step.description)}</p> : null}
              </div>
              <MediaFrame src={step.image} alt={fr(step.title)} sizes="16rem" className="aspect-[16/10] rounded-2xl shadow-lg">
                <span className="text-4xl font-bold text-white/90 drop-shadow-[0_0_20px_rgba(61,155,255,0.7)]">{step.year}</span>
              </MediaFrame>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand title="Rejoignez notre aventure !" text="Vous avez un projet ? Écrivons ensemble la prochaine étape." label="Découvrir nos services" href="/services" />
    </>
  );
}
