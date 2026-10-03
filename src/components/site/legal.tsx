import type { ReactNode } from "react";

/** Mise en forme commune des pages légales. */
export function LegalBody({ updated, children }: { updated: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-muted-foreground">Dernière mise à jour : {updated}</p>
      <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground [&_a]:text-brand-mid [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}
