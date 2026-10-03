import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, intro, center = false }: { eyebrow?: string; title: string; intro?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-widest text-brand-mid">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {intro ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p> : null}
    </div>
  );
}

/** Bandeau de titre des pages intérieures. */
export function PageHero({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: ReactNode }) {
  return (
    <section className="brand-gradient relative overflow-hidden text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl animate-rise">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{intro}</p> : null}
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
