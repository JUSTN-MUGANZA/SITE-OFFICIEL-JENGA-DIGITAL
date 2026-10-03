import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/cards";
import { JsonLd, PageHero } from "@/components/site/section";
import { fr, getPublicServices } from "@/lib/content/public";
import { getLiveBySlug } from "@/lib/content/repository";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getLiveBySlug("projects", slug);
  if (!project) return {};
  const image = project.seo.ogImage || project.coverImage;
  return {
    title: project.seo.title || fr(project.title),
    description: project.seo.description || fr(project.summary),
    alternates: { canonical: `/realisations/${project.slug}` },
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const project = await getLiveBySlug("projects", slug);
  if (!project) notFound();
  const services = (await getPublicServices()).filter((s) => project.serviceIds.includes(s.id));
  const url = siteUrl();

  const facts = [
    { label: "Client", value: project.client },
    { label: "Secteur", value: project.sector },
    { label: "Année", value: project.year ? String(project.year) : "" },
  ].filter((f) => f.value);

  return (
    <>
      <PageHero eyebrow="Réalisation" title={fr(project.title)} intro={fr(project.summary)} />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Link href="/realisations" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-mid hover:text-brand">
          <ArrowLeft className="size-4" aria-hidden /> Toutes les réalisations
        </Link>
        {project.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-muted shadow-lg">
            <Image src={project.coverImage} alt={project.coverAlt || fr(project.title)} fill priority sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
          </div>
        ) : null}
        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-ink/90">
            {(fr(project.body) || fr(project.summary)).split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
          <aside className="h-fit space-y-6 rounded-2xl border border-border bg-muted p-6">
            {facts.length > 0 ? (
              <dl className="space-y-3">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                    <dd className="font-semibold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {services.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Services</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link href={`/services/${s.slug}`} className="inline-flex rounded-full bg-background px-3 py-1 text-sm font-medium text-brand-mid hover:text-brand">
                        {fr(s.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.technologies.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technologies</h2>
                <p className="mt-2 text-sm text-ink">{project.technologies.join(", ")}</p>
              </div>
            ) : null}
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-mid">
                Voir le site <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
          </aside>
        </div>
        {project.gallery.length > 0 ? (
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((img) => (
              <div key={img.url} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image src={img.url} alt={img.alt || fr(project.title)} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </article>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: fr(project.title),
          description: fr(project.summary),
          url: `${url}/realisations/${project.slug}`,
          ...(project.coverImage ? { image: project.coverImage } : {}),
          creator: { "@id": `${url}/#organisation` },
        }}
      />
    </>
  );
}
