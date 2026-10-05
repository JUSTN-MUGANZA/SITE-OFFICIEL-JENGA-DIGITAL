import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentItem } from "@/lib/content/schemas";
import { Chip, Tag } from "./section";
import { SocialIcon } from "./social-icons";
import { ServiceIcon } from "./service-icon";
import { Initials, MediaFrame, TechLines } from "./visuals";

const fr = (v: { fr: string } | undefined) => v?.fr ?? "";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid hover:shadow-[var(--shadow-electric)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-card)] transition hover:border-brand/40 hover:text-brand";
export const btnOutlineLight =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15";
export const textLink = "inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2.5";

export const card = "rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]";
export const cardHover = "transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[var(--shadow-lift)]";

/** Carte de service : icône, texte, livrables en étiquettes. */
export function ServiceCard({ service, index }: { service: ContentItem<"services">; index?: number }) {
  const number = index !== undefined ? String(index + 1).padStart(2, "0") : null;
  return (
    <Link href={`/services/${service.slug}`} className={`group flex h-full flex-col overflow-hidden ${card} ${cardHover}`}>
      {service.image ? (
        <div className="relative">
          <MediaFrame src={service.image} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
          <span className="absolute -bottom-6 left-7 inline-flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-[var(--shadow-electric)] sm:left-8">
            <ServiceIcon name={service.icon} className="size-6" />
          </span>
          {number ? (
            <span className="absolute right-4 top-4 rounded-full bg-surface/95 px-2.5 py-1 font-display text-xs font-bold text-brand shadow-sm">{number}</span>
          ) : null}
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col p-7 sm:p-8 ${service.image ? "pt-10 sm:pt-10" : ""}`}>
        {service.image ? null : (
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
              <ServiceIcon name={service.icon} className="size-6" />
            </span>
            {number ? <span className="font-display text-sm font-bold text-brand/35">{number}</span> : null}
          </div>
        )}
        <h3 className={`text-xl font-bold text-ink ${service.image ? "" : "mt-6"}`}>{fr(service.title)}</h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">{fr(service.shortDescription)}</p>
        {service.deliverables.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {service.deliverables.slice(0, 4).map((d) => (
              <Tag key={d}>{d}</Tag>
            ))}
          </div>
        ) : null}
        <span className={`${textLink} mt-6`}>
          Découvrir ce service <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Variante de la page Services (numérotée). */
export function ServiceFeatureCard({ service, index }: { service: ContentItem<"services">; index: number }) {
  return <ServiceCard service={service} index={index} />;
}

export function ProjectCard({ project, tag }: { project: ContentItem<"projects">; tag?: string }) {
  const label = tag || project.sector;
  const meta = [project.client, project.technologies.slice(0, 2).join(" · ")].filter(Boolean).join(" • ");
  return (
    <Link href={`/realisations/${project.slug}`} className={`group flex h-full flex-col overflow-hidden ${card} ${cardHover}`}>
      <div className="relative">
        <MediaFrame src={project.coverImage} alt={project.coverAlt || fr(project.title)} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
        {label ? (
          <span className="absolute left-4 top-4 rounded-full bg-surface/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink shadow-sm">{label}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {meta ? <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">{meta}</p> : null}
        <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{fr(project.title)}</h3>
        {fr(project.summary) ? <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{fr(project.summary)}</p> : <span className="flex-1" />}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-medium text-subtle">{project.year ?? "Étude de cas"}</span>
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-ink transition group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
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
    <figure className={`flex h-full flex-col p-7 ${card}`}>
      {testimonial.rating ? <Stars rating={testimonial.rating} /> : null}
      <blockquote className="mt-4 flex-1 text-[15px] italic leading-relaxed text-ink/80">« {fr(testimonial.quote)} »</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {testimonial.photo ? (
          <Image src={testimonial.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
        ) : (
          <Initials name={testimonial.author} className="size-11 rounded-full text-sm" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{testimonial.author}</p>
          {testimonial.role || testimonial.company ? (
            <p className="truncate text-xs text-subtle">{[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

const TEAM_SOCIALS = [
  { key: "linkedin", label: "LinkedIn", network: "linkedin" },
  { key: "x", label: "X", network: "x" },
] as const;

function TeamSocials({ member, className = "" }: { member: ContentItem<"team">; className?: string }) {
  return (
    <ul className={`flex gap-2 empty:hidden ${className}`}>
      {TEAM_SOCIALS.filter((s) => member.socials[s.key]).map((s) => (
        <li key={s.key}>
          <a
            href={member.socials[s.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-muted text-ink transition hover:bg-brand hover:text-white"
          >
            <SocialIcon network={s.network} className="size-3.5" />
            <span className="sr-only">
              {s.label} de {member.name}
            </span>
          </a>
        </li>
      ))}
      {member.socials.github ? (
        <li>
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-muted text-ink transition hover:bg-brand hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            <span className="sr-only">GitHub de {member.name}</span>
          </a>
        </li>
      ) : null}
      {member.socials.website ? (
        <li>
          <a
            href={member.socials.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-muted text-ink transition hover:bg-brand hover:text-white"
          >
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">Portfolio de {member.name}</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}

/** Centres incomplete rows so one or two members don't sit alone on the left. */
export function TeamGrid({ team, className = "mt-12" }: { team: ContentItem<"team">[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap justify-center gap-5 ${className}`}>
      {team.map((m) => (
        <li key={m.id} className="w-full max-w-sm sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
          <TeamCard member={m} />
        </li>
      ))}
    </ul>
  );
}

export function TeamCard({ member }: { member: ContentItem<"team"> }) {
  return (
    <article className={`group flex h-full flex-col overflow-hidden ${card}`}>
      <div className="relative aspect-square overflow-hidden bg-muted-strong">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <Initials name={member.name} className="absolute inset-0 text-5xl" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-ink">{member.name}</h3>
        <p className="text-sm font-medium text-brand">{fr(member.role)}</p>
        {fr(member.bio) ? <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{fr(member.bio)}</p> : <span className="flex-1" />}
        <TeamSocials member={member} className="mt-4" />
      </div>
    </article>
  );
}

/** Fiche détaillée de la page Équipe : grande photo, présentation et compétences. */
export function TeamProfileCard({ member }: { member: ContentItem<"team"> }) {
  return (
    <article className={`group flex h-full flex-col overflow-hidden ${card}`}>
      <div className="relative h-80 overflow-hidden bg-muted-strong">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <Initials name={member.name} className="absolute inset-0 text-6xl" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface/70 to-transparent" aria-hidden />
        {member.location ? (
          <span className="absolute left-4 top-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur">
            {member.location}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">{member.name}</h3>
            <p className="mt-0.5 text-sm font-semibold text-brand">{fr(member.role)}</p>
          </div>
          <TeamSocials member={member} className="shrink-0" />
        </div>
        {fr(member.bio) ? <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{fr(member.bio)}</p> : null}
        {member.skills.length > 0 ? (
          <div className="mt-auto pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle">Compétences</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {member.skills.map((s) => (
                <li key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-ink/80">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** Chiffre clé : petite étiquette, grand nombre, légende. */
export function StatCard({ label, value, text }: { label: string; value: string; text?: string }) {
  return (
    <div className={`p-6 ${card}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{value}</p>
      {text ? <p className="mt-2 text-sm text-muted-foreground">{text}</p> : null}
    </div>
  );
}

/** Étape numérotée d'une méthode. */
export function StepCard({ index, title, text, meta }: { index: number; title: string; text: string; meta?: string }) {
  return (
    <div className={`h-full p-6 ${card}`}>
      <p className="font-display text-4xl font-extrabold text-brand/30">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      {meta ? <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">{meta}</p> : null}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

/** Grand panneau nuit d'appel à l'action, en fin de page. */
export function CtaBand({
  chip = "Parlons de votre projet",
  title = "Prêt à donner vie à votre prochain projet digital ?",
  text = "Expliquez-nous votre besoin : nous vous répondons avec une proposition claire et chiffrée.",
  href = "/contact",
  label = "Démarrer votre projet",
  secondary,
}: {
  chip?: string;
  title?: ReactNode;
  text?: ReactNode;
  href?: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <div className="navy-surface relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div className="tech-grid-dark absolute inset-0" aria-hidden />
        <TechLines light className="absolute -right-16 -top-10 h-[140%] opacity-60" />
        <div className="relative mx-auto max-w-2xl">
          <Chip light>{chip}</Chip>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-[2.75rem]">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">{text}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={href} className={btnPrimary}>
              {label} <ArrowRight className="size-4" aria-hidden />
            </Link>
            {secondary ? (
              <a href={secondary.href} className={btnOutlineLight}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-16 text-center">
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{text}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
