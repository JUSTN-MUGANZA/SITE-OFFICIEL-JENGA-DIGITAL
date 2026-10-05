import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { card, CtaBand } from "@/components/site/cards";
import { container, JsonLd, PageHero } from "@/components/site/section";
import { fr, getPublicFaqs } from "@/lib/content/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Questions fréquentes",
  description: "Délais, prix, référencement, accompagnement et paiement : les réponses aux questions les plus fréquentes sur les services de JENGA Digital.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await getPublicFaqs();
  return (
    <>
      <PageHero eyebrow="Clarté & transparence" title="Questions fréquentes" intro="Délais, tarifs, accompagnement, paiement : les réponses directes aux questions que l'on nous pose le plus." crumbs={[{ href: "/", label: "Accueil" }, { label: "FAQ" }]} />
      <section className="bg-muted">
        <div className={`py-16 sm:py-20 ${container}`}>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <details key={f.id} open={i === 0} className={`group transition open:shadow-[var(--shadow-lift)] ${card}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                    <span className="size-2 shrink-0 rounded-full bg-brand" aria-hidden />
                    {fr(f.question)}
                  </span>
                  <ChevronDown className="size-5 shrink-0 text-brand transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="whitespace-pre-line px-6 pb-6 pl-11 leading-relaxed text-muted-foreground">{fr(f.answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand chip="Une autre question ?" title="Posez-nous directement votre question" text="Écrivez-nous : nous vous répondons personnellement." label="Nous écrire" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: fr(f.question),
            acceptedAnswer: { "@type": "Answer", text: fr(f.answer) },
          })),
        }}
      />
    </>
  );
}
