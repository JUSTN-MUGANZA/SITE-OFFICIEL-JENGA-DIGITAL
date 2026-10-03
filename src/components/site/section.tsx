import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TechLines } from "./visuals";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "text-accent-light" : "text-brand"}`}>
      <span className="flex gap-0.5" aria-hidden>
        <span className="h-3 w-1 rounded-sm bg-current" />
        <span className="h-3 w-1 rounded-sm bg-current opacity-60" />
      </span>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {intro ? <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-muted-foreground"}`}>{intro}</p> : null}
    </div>
  );
}

type Crumb = { href?: string; label: string };

/** Bandeau sombre en haut des pages intérieures. */
export function PageHero({ eyebrow, title, intro, crumbs, image }: { eyebrow?: string; title: string; intro?: ReactNode; crumbs?: Crumb[]; image?: string }) {
  return (
    <section className="navy-surface relative overflow-hidden text-white">
      <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
      {image ? (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden>
          <Image src={image} alt="" fill sizes="50vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/60 to-transparent" />
        </div>
      ) : (
        <>
          <TechLines className="absolute -right-10 top-0 h-full opacity-80 sm:right-0" />
          <Image
            src="/brand/mark-transparent.png"
            alt=""
            width={256}
            height={256}
            className="absolute right-[8%] top-1/2 hidden size-40 -translate-y-1/2 opacity-25 drop-shadow-[0_0_40px_rgba(61,155,255,0.7)] lg:block"
          />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
        {crumbs ? (
          <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-white/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/90">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <Eyebrow light>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-3 max-w-3xl animate-rise text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{intro}</p> : null}
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

export const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
