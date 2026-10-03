import { Building2, CalendarDays, CheckCircle2, Code2, ExternalLink, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/cards";
import { container, JsonLd, PageHero } from "@/components/site/section";
import { MediaFrame } from "@/components/site/visuals";
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

/** Sépare le texte en paragraphes de présentation et en liste de fonctionnalités (lignes « - … »). */
function splitBody(text: string) {
  const features: string[] = [];
  const paragraphs: string[] = [];
  for (const block of text.split(/\n{2,}/)) {
    const lines = block.split("\n");
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) features.push(...lines.map((l) => l.replace(/^\s*[-•*]\s+/, "")));
    else paragraphs.push(block);
  }
  return { features, paragraphs };
}

export default async function ProjectPage({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const project = await getLiveBySlug("projects", slug);
  if (!project) notFound();
  const services = (await getPublicServices()).filter((s) => project.serviceIds.includes(s.id));
  const url = siteUrl();
  const { features, paragraphs } = splitBody(fr(project.body) || fr(project.summary));

  const facts = [
    { icon: Tag, label: "Catégorie", value: services.map((s) => fr(s.title)).join(", ") || project.sector },
    { icon: Code2, label: "Technologies", value: project.technologies.join(", ") },
    { icon: CalendarDays, label: "Année", value: project.year ? String(project.year) : "" },
    { icon: Building2, label: "Client", value: project.client },
  ].filter((f) => f.value);

  return (
    <>
      <PageHero
        title={fr(project.title)}
        intro={fr(project.summary)}
        crumbs={[{ href: "/", label: "Accueil" }, { href: "/realisations", label: "Projets" }, { label: fr(project.title) }]}
      />
      <article className={`grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.7fr_1fr] ${container}`}>
        <div className="min-w-0">
          <MediaFrame
            src={project.coverImage}
            alt={project.coverAlt || fr(project.title)}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="aspect-[16/10] rounded-3xl shadow-2xl shadow-navy-950/15"
          />
          <h2 className="mt-12 text-2xl font-bold text-ink">Présentation</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
            {paragraphs.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
          {features.length > 0 ? (
            <>
              <h2 className="mt-10 text-2xl font-bold text-ink">Fonctionnalités principales</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-ink/85">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {project.technologies.length > 0 ? (
            <>
              <h2 className="mt-10 text-lg font-semibold text-ink">Technologies utilisées</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand">
                    {t}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
          {facts.length > 0 ? (
            <dl className="space-y-5 rounded-3xl border border-border bg-white p-6 shadow-xl shadow-navy-950/5">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
                    <dd className="font-semibold text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : null}
          {project.gallery.length > 0 ? (
            <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-navy-950/5">
              <h2 className="font-semibold text-ink">Galerie</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {project.gallery.map((img) => (
                  <li key={img.url}>
                    <a href={img.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                      <Image src={img.url} alt={img.alt || fr(project.title)} fill sizes="12rem" className="object-cover transition hover:scale-105" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-mid"
            >
              Voir le site en ligne <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : null}
        </aside>
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
