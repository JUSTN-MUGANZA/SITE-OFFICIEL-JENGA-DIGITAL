import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-medium text-brand">Erreur 404</p>
      <h1 className="text-3xl font-semibold">Cette page n&apos;existe pas</h1>
      <p className="max-w-md text-muted-foreground">Le lien est peut-être ancien ou mal saisi.</p>
      <Link href="/" className={buttonClass("primary", "mt-2")}>
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
