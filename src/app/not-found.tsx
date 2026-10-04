import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TechLines } from "@/components/site/visuals";

export default function NotFound() {
  return (
    <main className="hero-glow relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="tech-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <TechLines className="absolute -right-16 bottom-0 h-full" />
      <div className="relative">
        <Link href="/" aria-label="JENGA Digital, accueil" className="inline-block">
          <Image src="/brand/logo-jenga-digital-transparent.png" alt="JENGA Digital" width={640} height={276} priority className="mx-auto h-12 w-auto" />
        </Link>
        <p className="mt-12 font-display text-[7rem] font-extrabold leading-none tracking-[-0.04em] text-brand sm:text-[10rem]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">Cette page est introuvable</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">Le lien est peut-être ancien ou mal saisi. Revenez à l&apos;accueil pour continuer votre visite.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid hover:shadow-[var(--shadow-electric)]"
        >
          <ArrowLeft className="size-4" aria-hidden /> Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
