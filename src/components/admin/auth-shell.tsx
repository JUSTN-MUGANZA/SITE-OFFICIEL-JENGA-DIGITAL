import { LayoutDashboard, Lock, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { TechLines } from "@/components/site/visuals";

const FEATURES = [
  { icon: LayoutDashboard, title: "Vue d'ensemble", text: "Messages, contenus et réglages du site au même endroit." },
  { icon: Mail, title: "Demandes de contact", text: "Chaque message du formulaire arrive ici." },
  { icon: Lock, title: "Accès privé", text: "Réservé aux administrateurs invités." },
];

/** Mise en page des écrans de connexion : panneau nuit à gauche, formulaire sur fond clair à droite. */
export function AuthShell({ title, subtitle, intro, children }: { title: string; subtitle?: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <main className="flex flex-1 bg-background p-3 sm:p-4">
      <section className="navy-surface relative hidden w-[46%] flex-col justify-between overflow-hidden rounded-3xl p-10 text-white lg:flex xl:p-14">
        <div className="tech-grid-dark absolute inset-0" aria-hidden />
        <TechLines light className="absolute -right-48 -top-10 h-[70%] opacity-50" />
        <div className="relative">
          <Image src="/brand/logo-jenga-digital-white.png" alt="JENGA Digital" width={720} height={310} priority className="h-16 w-auto" />
          <span className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 ring-1 ring-white/15">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Console d&apos;administration
          </span>
          <p className="mt-6 max-w-md font-display text-4xl font-extrabold leading-tight tracking-[-0.02em]">
            Pilotez votre site <span className="text-accent-light">en toute simplicité.</span>
          </p>
        </div>
        <ul className="relative mt-12 space-y-5">
          {FEATURES.map(({ icon: Icon, title: t, text }) => (
            <li key={t} className="flex gap-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-light ring-1 ring-white/10">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-white/60">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="relative mt-12 text-xs text-white/40">© {new Date().getFullYear()} JENGA Digital. Tous droits réservés.</p>
      </section>

      <section className="hero-glow flex flex-1 flex-col items-center justify-center px-2 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Image src="/brand/logo-jenga-digital-transparent.png" alt="JENGA Digital" width={640} height={276} priority className="mx-auto mb-8 h-14 w-auto lg:hidden" />
          <div className="rounded-2xl border border-border bg-white p-7 shadow-[var(--shadow-lift)] sm:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <ShieldCheck className="size-6" aria-hidden />
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-muted-foreground">{subtitle}</p> : null}
            {intro ? <p className="mt-4 text-sm text-muted-foreground">{intro}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
