import { ArrowRight, Building2, CalendarDays, Check, Code2, ExternalLink, Layers } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { btnOutline, btnPrimary, card, CtaBand } from "@/components/site/cards";
import { Breadcrumbs, container, Eyebrow, JsonLd, Tag } from "@/components/site/section";
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
  const category = services.map((s) => fr(s.title)).join(", ") || project.sector;

  const facts = [
    { icon: Layers, label: "Catégorie", value: category },
    { icon: Building2, label: "Client", value: project.client },
    { icon: CalendarDays, label: "Année", value: project.year ? String(project.year) : "" },
    { icon: Code2, label: "Technologies", value: project.technologies.slice(0, 3).join(", ") },
  ].filter((f) => f.value);

  return (
    <>
      <section className="hero-glow border-b border-border/70">
        <div className={`pb-14 pt-10 sm:pt-14 ${container}`}>
          <Breadcrumbs crumbs={[{ href: "/", label: "Accueil" }, { href: "/realisations", label: "Réalisations" }, { label: fr(project.title) }]} />
          <div className="mt-6 flex flex-wrap gap-2">
            {category ? <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">{category}</span> : null}
            {project.year ? <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/70 ring-1 ring-border">Année {project.year}</span> : null}
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="animate-rise text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.4rem]">{fr(project.title)}</h1>
              {fr(project.summary) ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{fr(project.summary)}</p> : null}
            </div>
            {project.liveUrl ? (
              <div className="lg:col-span-4 lg:text-right">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  Voir le projet en ligne <ExternalLink className="size-4" aria-hidden />
                </a>
              </div>
            ) : null}
          </div>
          <MediaFrame
            src={project.coverImage}
            alt={project.coverAlt || fr(project.title)}
            priority
            dark
            sizes="(min-width: 1320px) 1240px, 100vw"
            className="mt-10 aspect-[16/9] rounded-3xl shadow-[var(--shadow-lift)] sm:aspect-[21/9]"
          />
          {facts.length > 0 ? (
            <dl className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className={`p-5 ${card}`}>
                  <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">
                    <Icon className="size-4 text-brand" aria-hidden />
                    {label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <article className="bg-muted">
        <div className={`grid gap-10 py-16 sm:py-20 lg:grid-cols-12 ${container}`}>
          <aside className={`h-fit p-7 lg:sticky lg:top-28 lg:col-span-4 ${card}`}>
            <Image src="/brand/mark-transparent.png" alt="" width={48} height={48} className="size-10" />
            <h2 className="mt-5 text-xl font-bold text-ink">Fiche projet</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {project.client ? (
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Client</dt>
                  <dd className="mt-1 font-semibold text-ink">{project.client}</dd>
                </div>
              ) : null}
              {project.sector ? (
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Secteur</dt>
                  <dd className="mt-1 font-semibold text-ink">{project.sector}</dd>
                </div>
              ) : null}
              {services.length > 0 ? (
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Services</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5">
                      {services.map((s) => (
                        <li key={s.id}>
                          <Link href={`/services/${s.slug}`} className="flex items-center gap-2 font-semibold text-ink hover:text-brand">
                            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                            {fr(s.title)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
            <Link href="/contact" className={`${btnOutline} mt-7 w-full`}>
              Un projet similaire ? <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>

          <div className="min-w-0 lg:col-span-8">
            <Eyebrow>Le projet</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">Présentation</h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/80">
              {paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
            {features.length > 0 ? (
              <>
                <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink">Ce que nous avons livré</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className={`flex gap-3 p-5 text-sm font-medium text-ink ${card}`}>
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {project.technologies.length > 0 ? (
              <>
                <h2 className="mt-12 text-lg font-bold text-ink">Technologies utilisées</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </>
            ) : null}
            {project.gallery.length > 0 ? (
              <>
                <h2 className="mt-12 text-lg font-bold text-ink">Galerie</h2>
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.gallery.map((img) => (
                    <li key={img.url}>
                      <a href={img.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
                        <Image src={img.url} alt={img.alt || fr(project.title)} fill sizes="(min-width: 640px) 20rem, 50vw" className="object-cover transition hover:scale-[1.03]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </article>
      <CtaBand title="Prêt à construire une solution taillée pour votre activité ?" label="Estimer mon projet" secondary={{ href: "/realisations", label: "Voir d'autres réalisations" }} />
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
