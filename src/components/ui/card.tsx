import type { ReactNode } from "react";

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
      {title ? <h2 className="text-lg font-bold text-ink">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
