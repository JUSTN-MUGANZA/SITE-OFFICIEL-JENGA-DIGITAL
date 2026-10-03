import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, ProjectCard } from "@/components/site/cards";
import { container, JsonLd, PageHero, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { fr, getPublicService } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return {};
  return {
    title: service.seo.title || fr(service.title),
    description: service.seo.description || fr(service.shortDescription),
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: service.seo.ogImage ? { images: [service.seo.ogImage] } : undefined,
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) notFound();
  const projects = (await listLive("projects")).filter((p) => p.serviceIds.includes(service.id)).slice(0, 3);
  const url = siteUrl();

  return (
    <>
      <PageHero
        title={fr(service.title)}
        intro={fr(service.shortDescription)}
        crumbs={[{ href: "/", label: "Accueil" }, { href: "/services", label: "Services" }, { label: fr(service.title) }]}
      />
      <section className={`grid gap-12 py-20 lg:grid-cols-[2fr_1fr] ${container}`}>
        <div className="space-y-5 text-lg leading-relaxed text-ink/85">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
            <ServiceIcon name={service.icon} className="size-7" />
          </span>
          {(fr(service.body) || fr(service.shortDescription)).split(/\n{2,}/).map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
        <aside className="h-fit rounded-3xl border border-border bg-white p-7 shadow-xl shadow-navy-950/5 lg:sticky lg:top-28">
          {service.deliverables.length > 0 ? (
            <>
              <h2 className="font-semibold text-ink">Ce qui est inclus</h2>
              <ul className="mt-4 space-y-3">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {service.startingPrice ? <p className="mt-6 text-sm text-muted-foreground">À partir de <strong className="text-ink">{service.startingPrice}</strong></p> : null}
          <Link href={`/contact?service=${encodeURIComponent(service.slug)}`} className="mt-6 block rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-mid">
            Demander un devis
          </Link>
        </aside>
      </section>
      {projects.length > 0 ? (
        <section className="bg-muted">
          <div className={`py-20 ${container}`}>
            <SectionHeading eyebrow="Exemples" title="Projets réalisés avec ce service" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: fr(service.title),
          description: fr(service.shortDescription),
          url: `${url}/services/${service.slug}`,
          provider: { "@id": `${url}/#organisation` },
        }}
      />
    </>
  );
}
