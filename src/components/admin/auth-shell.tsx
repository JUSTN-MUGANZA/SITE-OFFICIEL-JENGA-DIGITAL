import { Cloud, ShieldCheck, UserRoundCheck, Zap } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { TechLines } from "@/components/site/visuals";

const FEATURES = [
  { icon: ShieldCheck, title: "Sécurisé", text: "Vos données sont protégées" },
  { icon: Zap, title: "Rapide", text: "Accès immédiat à votre espace" },
  { icon: Cloud, title: "Fiable", text: "Une plateforme stable et performante" },
  { icon: UserRoundCheck, title: "Privé", text: "Accès réservé aux administrateurs" },
];

/** Mise en page des écrans de connexion : panneau de marque à gauche, carte blanche à droite. */
export function AuthShell({ title, subtitle, intro, children }: { title: string; subtitle?: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <main className="navy-surface relative flex flex-1 overflow-hidden text-white">
      <div className="tech-grid absolute inset-0 opacity-50" aria-hidden />
      <TechLines className="absolute -right-20 top-0 h-full opacity-50" />
      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_30rem] lg:px-10 lg:py-16">
        <section className="hidden lg:block">
          <Image src="/brand/logo-jenga-digital-white.png" alt="JENGA Digital" width={720} height={310} priority className="h-24 w-auto" />
          <p className="mt-8 max-w-md text-3xl font-light leading-snug text-white/90">
            Des <strong className="font-semibold text-white">solutions digitales</strong> pour un avenir meilleur.
          </p>
          <ul className="mt-16 grid max-w-2xl grid-cols-4 divide-x divide-white/10">
            {FEATURES.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="px-4 text-center first:pl-0">
                <Icon className="mx-auto size-8 text-accent" aria-hidden />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-xs text-white/60">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-16 text-xs text-white/50">© {new Date().getFullYear()} JENGA Digital. Tous droits réservés.</p>
        </section>

        <section className="mx-auto w-full max-w-md text-ink">
          <Image src="/brand/logo-jenga-digital-white.png" alt="JENGA Digital" width={720} height={310} priority className="mx-auto mb-8 h-14 w-auto lg:hidden" />
          <div className="rounded-3xl bg-white/95 p-7 shadow-2xl shadow-navy-950/40 backdrop-blur sm:p-10">
            <div className="text-center">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ShieldCheck className="size-8" aria-hidden />
              </span>
              <h1 className="mt-4 text-3xl font-bold">{title}</h1>
              {subtitle ? <p className="mt-1 text-muted-foreground">{subtitle}</p> : null}
              {intro ? <p className="mt-4 text-sm text-muted-foreground">{intro}</p> : null}
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
