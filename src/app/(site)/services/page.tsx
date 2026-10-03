import type { Metadata } from "next";
import { CtaBand, ServiceFeatureCard } from "@/components/site/cards";
import { container, PageHero } from "@/components/site/section";
import { getPublicServices } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Développement web, applications mobiles, design graphique, communication digitale, maintenance et formation : des solutions digitales sur mesure.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <>
      <PageHero title="Nos services" intro="Des solutions digitales sur mesure pour vos besoins." crumbs={[{ href: "/", label: "Accueil" }, { label: "Services" }]} />
      <section className={`py-20 sm:py-24 ${container}`}>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceFeatureCard key={s.id} service={s} />
          ))}
        </div>
      </section>
      <CtaBand title="Un projet en tête ?" />
    </>
  );
}
