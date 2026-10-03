import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cards";
import { JsonLd, PageHero } from "@/components/site/section";
import { fr, getPublicFaqs } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Prix, délais, référencement, maintenance : les réponses aux questions les plus fréquentes sur nos services.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getPublicFaqs();
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions fréquentes" intro="Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons rapidement." />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="divide-y divide-border rounded-2xl border border-border">
          {faqs.map((f) => (
            <details key={f.id} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink">
                {fr(f.question)}
                <ChevronDown className="size-5 shrink-0 text-brand-mid transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{fr(f.answer)}</p>
            </details>
          ))}
        </div>
      </section>
      <CtaBand />
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
