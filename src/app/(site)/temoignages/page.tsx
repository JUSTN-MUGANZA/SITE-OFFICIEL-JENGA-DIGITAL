import type { Metadata } from "next";
import { CtaBand, EmptyState, TestimonialCard } from "@/components/site/cards";
import { container, JsonLd, PageHero } from "@/components/site/section";
import { fr } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";
import { siteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Témoignages clients",
  description: "Ce que les clients de JENGA Digital disent de leur site web, de leur application et de leur accompagnement.",
  path: "/temoignages",
});

export default async function TestimonialsPage() {
  const testimonials = await listLive("testimonials");
  const url = siteUrl();
  return (
    <>
      <PageHero eyebrow="Témoignages" title="Ils nous font confiance" intro="Ce que nos clients disent de leur collaboration avec nous, avec leurs propres mots." crumbs={[{ href: "/", label: "Accueil" }, { label: "Témoignages" }]} />
      <section className="bg-muted">
        <div className={`py-16 sm:py-20 ${container}`}>
          {testimonials.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          ) : (
            <EmptyState title="Les premiers avis arrivent bientôt" text="Vous avez travaillé avec nous ? Écrivez-nous pour partager votre expérience." />
          )}
        </div>
      </section>
      <CtaBand title="Et si votre projet était le prochain ?" />
      {testimonials.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": testimonials.map((t) => ({
              "@type": "Review",
              itemReviewed: { "@id": `${url}/#organisation` },
              author: { "@type": "Person", name: t.author },
              reviewBody: fr(t.quote),
              ...(t.rating ? { reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 } } : {}),
            })),
          }}
        />
      ) : null}
    </>
  );
}
