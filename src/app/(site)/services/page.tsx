import type { Metadata } from "next";
import { CtaBand, ServiceCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/section";
import { getPublicServices } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Services",
  description: "Création de sites web, applications, e-commerce, référencement, marketing digital et design : découvrez les services de JENGA Digital.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <>
      <PageHero eyebrow="Services" title="Des solutions digitales sur mesure" intro="Choisissez un service ou combinez-les : nous construisons la solution adaptée à votre activité et à votre budget." />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
