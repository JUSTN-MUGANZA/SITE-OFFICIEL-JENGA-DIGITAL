import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TechLines } from "@/components/site/visuals";

export default function NotFound() {
  return (
    <main className="navy-surface relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center text-white">
      <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
      <TechLines className="absolute -right-16 bottom-0 h-full opacity-60" />
      <TechLines className="absolute -left-16 bottom-0 h-full -scale-x-100 opacity-40" />
      <div className="relative">
        <Link href="/" aria-label="JENGA Digital, accueil" className="inline-block">
          <Image src="/brand/logo-jenga-digital-white.png" alt="JENGA Digital" width={720} height={310} priority className="mx-auto h-12 w-auto" />
        </Link>
        <p className="text-gradient mt-12 text-[7rem] font-bold leading-none tracking-tight drop-shadow-[0_0_40px_rgba(61,155,255,0.45)] sm:text-[10rem]">404</p>
        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Cette page est introuvable</h1>
        <p className="mx-auto mt-3 max-w-md text-white/70">Le lien est peut-être ancien ou mal saisi. Revenez à l&apos;accueil pour continuer votre visite.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-mid"
        >
          <ArrowLeft className="size-4" aria-hidden /> Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
