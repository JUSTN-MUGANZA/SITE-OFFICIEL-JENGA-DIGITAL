import { Check, Code2, MapPin, Smartphone } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Visuels décoratifs dessinés en code (aucune photo nécessaire) :
 * ils prennent le relais tant que les vraies images ne sont pas envoyées.
 */

/** Lignes fines inspirées du logo (briques empilées). */
export function TechLines({ className = "", light = false }: { className?: string; light?: boolean }) {
  const stroke = light ? "#7bd0ff" : "#0052ff";
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className={`pointer-events-none ${className}`}>
      <g stroke={stroke} strokeOpacity={light ? 0.35 : 0.14} strokeWidth="1.25">
        <path d="M60 380 L60 250 L120 210 L120 120 L180 80 L180 20" />
        <path d="M110 390 L110 270 L170 230 L170 140 L230 100 L230 30" />
        <path d="M160 400 L160 290 L220 250 L220 160 L280 120 L280 50 L320 26" />
        <path d="M210 400 L210 310 L270 270 L270 180 L330 140 L330 70" />
        <path d="M260 400 L260 330 L320 290 L320 200 L380 160" />
      </g>
    </svg>
  );
}

const STEPS = [
  { label: "Cadrage du besoin", done: true },
  { label: "Maquettes validées", done: true },
  { label: "Développement", done: false, current: true },
  { label: "Mise en ligne", done: false },
];

/** Carte « console » de l'en-tête de l'accueil : le suivi d'un projet chez JENGA. */
export function ProjectConsole({ location }: { location?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[30rem]" aria-hidden>
      <div className="absolute -inset-8 rounded-[2rem] bg-brand/10 blur-3xl" />
      <div className="relative rounded-3xl border border-border bg-white p-5 shadow-[var(--shadow-lift)] sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[11px] tracking-wide text-subtle">jenga / atelier</span>
          </div>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">En cours</span>
        </div>

        <div className="mt-5 rounded-2xl bg-muted p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle">Votre projet</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-display text-xl font-bold text-ink">Site web & application</p>
            <span className="font-display text-2xl font-extrabold text-brand">72%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-tint">
            <div className="h-full w-[72%] rounded-full bg-brand" />
          </div>
        </div>

        <ol className="mt-4 space-y-2.5">
          {STEPS.map((s) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full ${
                  s.done ? "bg-brand text-white" : s.current ? "bg-brand-soft text-brand ring-2 ring-brand/30" : "bg-muted text-subtle"
                }`}
              >
                {s.done ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
              </span>
              <span className={s.done || s.current ? "font-medium text-ink" : "text-subtle"}>{s.label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand text-white">
              <Code2 className="size-4" />
            </span>
            <span className="text-xs font-semibold text-ink">Web</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-teal text-white">
              <Smartphone className="size-4" />
            </span>
            <span className="text-xs font-semibold text-ink">Mobile</span>
          </div>
        </div>
      </div>
      {location ? (
        <div className="absolute -bottom-10 -left-3 flex items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-[var(--shadow-lift)] sm:-left-8">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <MapPin className="size-4" />
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">Basés à</span>
            <span className="block text-sm font-semibold text-ink">{location}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** Photo si elle existe, sinon un visuel clair quadrillé avec l'emblème. */
export function MediaFrame({
  src,
  alt,
  sizes,
  priority = false,
  dark = false,
  className = "",
  children,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${dark ? "bg-navy-900" : "bg-muted-strong"} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className={`absolute inset-0 ${dark ? "navy-surface" : "bg-gradient-to-br from-brand-soft via-muted to-brand-tint"}`}>
          <div className={`absolute inset-0 ${dark ? "tech-grid-dark" : "tech-grid"}`} />
          <TechLines light={dark} className="absolute -bottom-8 -right-8 h-[120%]" />
          <div className={`absolute inset-0 flex items-center justify-center ${dark ? "text-accent-light" : "text-brand"}`}>
            {children ?? <Image src="/brand/mark-transparent.png" alt="" width={96} height={96} className="size-14 opacity-80" />}
          </div>
        </div>
      )}
    </div>
  );
}

/** Initiales sur fond bleu, quand une personne n'a pas encore de photo. */
export function Initials({ name, className = "" }: { name: string; className?: string }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span className={`inline-flex items-center justify-center bg-brand-soft font-display font-bold text-brand ${className}`} aria-hidden>
      {letters}
    </span>
  );
}
