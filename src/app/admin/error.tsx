"use client";

import { useEffect } from "react";
import { Button, buttonClass } from "@/components/ui/button";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Le tableau de bord n&apos;a pas pu s&apos;afficher</h1>
        <p className="text-sm text-muted-foreground">
          Une erreur est survenue côté serveur. Le diagnostic indique ce qui ne fonctionne pas dans la configuration.
        </p>
        {error.digest ? <p className="text-xs text-muted-foreground">Référence : {error.digest}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => retry()}>Réessayer</Button>
          <a href="/api/health" className={buttonClass("secondary")}>
            Voir le diagnostic
          </a>
        </div>
      </div>
    </main>
  );
}
