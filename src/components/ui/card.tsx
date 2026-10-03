import type { ReactNode } from "react";

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
