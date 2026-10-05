import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10";

/** Petite étiquette en capitales au-dessus des titres. */
export function Eyebrow({ children, light = false, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${light ? "text-accent-light" : "text-brand"} ${className}`}>{children}</p>;
}

/** Pastille arrondie avec point lumineux (haut des pages). */
export function Chip({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        light ? "bg-white/10 text-white/80 ring-1 ring-white/15" : "bg-surface text-ink/80 shadow-[var(--shadow-card)] ring-1 ring-border"
      }`}
    >
      <span className={`size-1.5 rounded-full ${light ? "bg-accent" : "bg-brand"}`} aria-hidden />
      {children}
    </span>
  );
}

/** Petite étiquette technique (technologies, livrables). */
export function Tag({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium tracking-wide ${
        light ? "bg-white/10 text-white/80" : "bg-muted text-muted-foreground ring-1 ring-border"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Titre de section. Par défaut le titre est à gauche et l'introduction à droite,
 * comme sur la maquette ; `center` les empile au centre.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  light?: boolean;
  action?: ReactNode;
}) {
  const titleClass = `mt-3 text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[2.6rem] ${light ? "text-white" : "text-ink"}`;
  const introClass = `text-base leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`;
  if (center) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
        <h2 className={titleClass}>{title}</h2>
        {intro ? <p className={`mt-4 ${introClass}`}>{intro}</p> : null}
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    );
  }
  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
        <h2 className={titleClass}>{title}</h2>
      </div>
      {intro || action ? (
        <div className="lg:col-span-4 lg:col-start-9 lg:pb-1">
          {intro ? <p className={introClass}>{intro}</p> : null}
          {action ? <div className={intro ? "mt-4" : ""}>{action}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs font-medium text-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
            {c.href ? (
              <Link href={c.href} className="hover:text-brand">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-brand">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** En-tête clair des pages intérieures, avec un encart facultatif à droite. */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  crumbs,
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Fin du titre, affichée en bleu sur une seconde ligne. */
  accent?: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-border/70">
      <div className={`relative pb-14 pt-10 sm:pb-16 sm:pt-14 ${container}`}>
        {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
        <div className={`grid gap-10 lg:grid-cols-12 lg:items-end ${crumbs ? "mt-6" : ""}`}>
          <div className={aside ? "lg:col-span-8" : "lg:col-span-9"}>
            {eyebrow ? <Chip>{eyebrow}</Chip> : null}
            <h1 className="mt-5 animate-rise text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.6rem]">
              {title}
              {accent ? (
                <>
                  <br />
                  <span className="text-brand">{accent}</span>
                </>
              ) : null}
            </h1>
            {intro ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p> : null}
          </div>
          {aside ? <div className="lg:col-span-4">{aside}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Données structurées pour Google et les assistants IA ; "<" échappé pour rester dans la balise.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
