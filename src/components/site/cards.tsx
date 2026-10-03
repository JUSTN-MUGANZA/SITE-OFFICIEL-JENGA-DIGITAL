import { ArrowRight, ArrowUpRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentItem } from "@/lib/content/schemas";
import { SocialIcon } from "./social-icons";
import { ServiceIcon } from "./service-icon";
import { Initials, MediaFrame, TechLines } from "./visuals";

const fr = (v: { fr: string } | undefined) => v?.fr ?? "";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-mid";
export const btnOutlineLight =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-brand/40 px-5 py-2.5 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand-soft";

/** Carte compacte (accueil). */
export function ServiceCard({ service }: { service: ContentItem<"services"> }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm shadow-ink/5 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink">{fr(service.title)}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{fr(service.shortDescription)}</p>
      <ArrowRight className="mt-5 size-5 text-brand transition group-hover:translate-x-1" aria-hidden />
      <span className="sr-only">En savoir plus</span>
    </Link>
  );
}

/** Carte illustrée (page Services). */
export function ServiceFeatureCard({ service }: { service: ContentItem<"services"> }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
    >
      <MediaFrame src={service.seo.ogImage} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/9]">
        <ServiceIcon name={service.icon} className="size-16 text-accent-light drop-shadow-[0_0_24px_rgba(61,155,255,0.8)]" />
      </MediaFrame>
      <div className="relative flex flex-1 flex-col p-6 pt-8">
        <span className="absolute -top-6 left-6 inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/40 ring-4 ring-white">
          <ServiceIcon name={service.icon} className="size-6" />
        </span>
        <h3 className="text-lg font-semibold text-ink">{fr(service.title)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{fr(service.shortDescription)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Voir le détail <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ProjectCard({ project, tag }: { project: ContentItem<"projects">; tag?: string }) {
  const label = tag || project.sector;
  return (
    <Link
      href={`/realisations/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
    >
      <MediaFrame src={project.coverImage} alt={project.coverAlt || fr(project.title)} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-ink">{fr(project.title)}</h3>
          <ArrowUpRight className="size-5 shrink-0 text-brand transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </div>
        {label ? <span className="mt-3 inline-flex w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">{label}</span> : null}
      </div>
    </Link>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`size-4 ${i < rating ? "fill-current" : "opacity-30"}`} aria-hidden />
      ))}
    </span>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: ContentItem<"testimonials"> }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-lg shadow-navy-950/10">
      <Quote className="size-8 fill-brand-soft text-brand" aria-hidden />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">« {fr(testimonial.quote)} »</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {testimonial.photo ? (
          <Image src={testimonial.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
        ) : (
          <Initials name={testimonial.author} className="size-12 rounded-full text-sm" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{testimonial.author}</p>
          {testimonial.role || testimonial.company ? (
            <p className="truncate text-xs text-muted-foreground">{[testimonial.role, testimonial.company].filter(Boolean).join(", ")}</p>
          ) : null}
          {testimonial.rating ? <div className="mt-1">{<Stars rating={testimonial.rating} />}</div> : null}
        </div>
      </figcaption>
    </figure>
  );
}

const TEAM_SOCIALS = [
  { key: "linkedin", label: "LinkedIn", network: "linkedin" },
  { key: "x", label: "X", network: "x" },
] as const;

export function TeamCard({ member }: { member: ContentItem<"team"> }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-[4/4] overflow-hidden bg-brand-soft">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <Initials name={member.name} className="absolute inset-0 text-5xl" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-ink">{member.name}</h3>
        <p className="text-sm font-medium text-brand">{fr(member.role)}</p>
        {fr(member.bio) ? <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{fr(member.bio)}</p> : <span className="flex-1" />}
        <ul className="mt-4 flex gap-2">
          {TEAM_SOCIALS.filter((s) => member.socials[s.key]).map((s) => (
            <li key={s.key}>
              <a
                href={member.socials[s.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-brand transition hover:bg-brand hover:text-white"
              >
                <SocialIcon network={s.network} className="size-3.5" />
                <span className="sr-only">
                  {s.label} de {member.name}
                </span>
              </a>
            </li>
          ))}
          {member.socials.website ? (
            <li>
              <a
                href={member.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-brand transition hover:bg-brand hover:text-white"
              >
                <ArrowUpRight className="size-3.5" aria-hidden />
                <span className="sr-only">Site de {member.name}</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}

/** Bandeau d'appel à l'action, en fin de page. */
export function CtaBand({
  title = "Prêt à donner vie à votre projet ?",
  text = "Parlons de vos idées et trouvons ensemble la meilleure solution.",
  href = "/contact",
  label = "Nous contacter",
}: {
  title?: ReactNode;
  text?: ReactNode;
  href?: string;
  label?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="navy-surface relative overflow-hidden rounded-3xl px-6 py-10 text-white shadow-2xl shadow-navy-950/20 sm:px-12">
        <div className="tech-grid absolute inset-0 opacity-50" aria-hidden />
        <TechLines className="absolute -right-10 -top-10 h-[160%] opacity-60" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-xl text-white/75">{text}</p>
          </div>
          <Link href={href} className={`${btnPrimary} shrink-0`}>
            {label} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-brand/30 bg-brand-soft/50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{text}</p>
    </div>
  );
}
