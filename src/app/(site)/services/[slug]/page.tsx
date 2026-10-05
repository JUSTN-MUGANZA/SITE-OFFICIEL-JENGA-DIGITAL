import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { btnPrimary, card, CtaBand, ProjectCard, StepCard } from "@/components/site/cards";
import { container, Eyebrow, JsonLd, PageHero, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { MediaFrame } from "@/components/site/visuals";
import { METHOD } from "@/lib/content/method";
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
  const quoteHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={fr(service.title)}
        intro={fr(service.shortDescription)}
        crumbs={[{ href: "/", label: "Accueil" }, { href: "/services", label: "Services" }, { label: fr(service.title) }]}
        aside={
          <div className={`flex items-center gap-4 p-5 ${card}`}>
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-[var(--shadow-electric)]">
              <ServiceIcon name={service.icon} className="size-7" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">{service.startingPrice ? "À partir de" : "Tarif"}</p>
              <p className="font-display text-lg font-bold text-ink">{service.startingPrice || "Sur devis, selon votre besoin"}</p>
            </div>
          </div>
        }
      />
      {service.image ? (
        <div className={`pt-10 sm:pt-14 ${container}`}>
          <MediaFrame src={service.image} alt="" priority sizes="(min-width: 1320px) 1240px, 100vw" className="aspect-[16/9] rounded-2xl sm:aspect-[21/8]" />
        </div>
      ) : null}
      <section className={`grid gap-10 py-20 lg:grid-cols-12 ${container}`}>
        <div className="lg:col-span-7">
          {fr(service.body) ? (
            <div className="space-y-5 text-lg leading-relaxed text-ink/85">
              {fr(service.body)
                .split(/\n{2,}/)
                .map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
            </div>
          ) : (
            <>
              <Eyebrow>Ce qui est inclus</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">Ce que nous réalisons pour vous</h2>
            </>
          )}
          {service.deliverables.length > 0 ? (
            <ul className={`grid gap-4 sm:grid-cols-2 ${fr(service.body) ? "mt-10" : "mt-8"}`}>
              {service.deliverables.map((d, i) => (
                <li key={d} className={`p-5 ${card}`}>
                  <span className="font-display text-sm font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-semibold text-ink">{d}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className={`h-fit p-7 lg:sticky lg:top-28 lg:col-span-4 lg:col-start-9 ${card}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Votre projet</p>
          <h2 className="mt-2 text-xl font-bold text-ink">Un besoin en {fr(service.title).toLowerCase()} ?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Décrivez-nous votre projet : nous revenons vers vous avec une proposition claire et un devis gratuit.</p>
          <ul className="mt-5 space-y-3">
            {["Devis gratuit et sans engagement", "Un interlocuteur dédié", "Suivi après la mise en ligne"].map((d) => (
              <li key={d} className="flex gap-3 text-sm font-medium text-ink">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <Link href={quoteHref} className={`${btnPrimary} mt-7 w-full`}>
            Demander un devis <ArrowRight className="size-4" aria-hidden />
          </Link>
        </aside>
      </section>
      <section className="bg-muted">
        <div className={`py-20 ${container}`}>
          <SectionHeading eyebrow="Déroulement" title="Comment nous travaillons" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((m, i) => (
              <li key={m.title}>
                <StepCard index={i} title={m.title} text={m.text} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      {projects.length > 0 ? (
        <section className={`py-20 ${container}`}>
          <SectionHeading eyebrow="Exemples" title="Projets réalisés avec ce service" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : null}
      <CtaBand href={quoteHref} label="Demander un devis" />
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
