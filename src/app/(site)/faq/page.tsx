import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cards";
import { container, JsonLd, PageHero } from "@/components/site/section";
import { fr, getPublicFaqs } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Délais, prix, accompagnement, paiement : les réponses aux questions les plus fréquentes sur nos services.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getPublicFaqs();
  return (
    <>
      <PageHero title="Questions fréquentes" intro="Toutes les réponses à vos questions." crumbs={[{ href: "/", label: "Accueil" }, { label: "FAQ" }]} />
      <section className="bg-muted">
        <div className={`py-16 sm:py-20 ${container}`}>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <details key={f.id} open={i === 0} className="group rounded-2xl border border-border bg-white shadow-sm transition open:shadow-lg open:shadow-brand/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-ink [&::-webkit-details-marker]:hidden">
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
      <CtaBand title="Vous avez d'autres questions ?" text="Contactez-nous, nous serons ravis de vous répondre." />
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
