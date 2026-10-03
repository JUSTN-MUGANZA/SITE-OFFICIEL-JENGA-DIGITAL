import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Visuels décoratifs dessinés en code (aucune photo nécessaire) :
 * ils prennent le relais tant que les vraies images ne sont pas envoyées.
 */

/** Lignes lumineuses inspirées du logo (briques empilées). */
export function TechLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className={`pointer-events-none ${className}`}>
      <defs>
        <linearGradient id="tl-stroke" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1467f0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#3d9bff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#8cc4ff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g stroke="url(#tl-stroke)" strokeWidth="1.5">
        <path d="M60 380 L60 250 L120 210 L120 120 L180 80 L180 20" />
        <path d="M110 390 L110 270 L170 230 L170 140 L230 100 L230 30" />
        <path d="M160 400 L160 290 L220 250 L220 160 L280 120 L280 50 L320 26" />
        <path d="M210 400 L210 310 L270 270 L270 180 L330 140 L330 70" />
        <path d="M260 400 L260 330 L320 290 L320 200 L380 160" />
      </g>
      <g fill="#3d9bff">
        <circle cx="180" cy="20" r="2.5" />
        <circle cx="230" cy="30" r="2.5" />
        <circle cx="320" cy="26" r="2.5" />
        <circle cx="330" cy="70" r="2.5" />
        <circle cx="380" cy="160" r="2.5" />
      </g>
    </svg>
  );
}

/** Ordinateur stylisé affichant un mini tableau de bord, pour l'en-tête de l'accueil. */
export function DeviceShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden>
      <div className="absolute -inset-10 rounded-full bg-brand/30 blur-3xl" />
      <div className="relative animate-float">
        {/* Écran */}
        <div className="rounded-t-2xl border border-white/15 bg-navy-950 p-2.5 shadow-2xl shadow-brand/30">
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-navy-800 to-navy-950">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="size-2 rounded-full bg-red-400/80" />
              <span className="size-2 rounded-full bg-amber-400/80" />
              <span className="size-2 rounded-full bg-emerald-400/80" />
              <span className="ml-3 h-2 w-32 rounded-full bg-white/10" />
            </div>
            <div className="grid grid-cols-[3.5rem_1fr] gap-3 p-3 sm:grid-cols-[5rem_1fr]">
              <div className="space-y-2">
                <Image src="/brand/mark-transparent.png" alt="" width={64} height={64} className="mx-auto size-8 sm:size-10" />
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`block h-2 rounded-full ${i === 0 ? "bg-brand" : "bg-white/10"}`} />
                ))}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {["bg-brand", "bg-accent", "bg-brand-mid"].map((c) => (
                    <div key={c} className="rounded-md bg-white/5 p-2">
                      <span className={`block size-3 rounded ${c}`} />
                      <span className="mt-2 block h-2 w-3/4 rounded-full bg-white/20" />
                      <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
                <div className="rounded-md bg-white/5 p-2">
                  <svg viewBox="0 0 200 60" className="h-16 w-full sm:h-20">
                    <defs>
                      <linearGradient id="ds-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#3d9bff" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#3d9bff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 45 L20 40 L40 42 L60 30 L80 34 L100 22 L120 26 L140 14 L160 20 L180 8 L200 12 L200 60 L0 60 Z" fill="url(#ds-area)" />
                    <path d="M0 45 L20 40 L40 42 L60 30 L80 34 L100 22 L120 26 L140 14 L160 20 L180 8 L200 12" stroke="#3d9bff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="h-8 rounded-md bg-white/5" />
                  <span className="h-8 rounded-md bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Socle */}
        <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-gradient-to-b from-slate-300 to-slate-500" />
        {/* Téléphone */}
        <div className="absolute -bottom-6 -left-4 w-24 rounded-2xl border border-white/20 bg-navy-950 p-1.5 shadow-2xl sm:-left-8 sm:w-28">
          <div className="rounded-xl bg-gradient-to-b from-brand to-navy-800 p-2">
            <span className="mx-auto block h-1 w-8 rounded-full bg-white/30" />
            <span className="mt-3 block h-2 w-3/4 rounded-full bg-white/60" />
            <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-white/30" />
            <span className="mt-3 block h-10 rounded-lg bg-white/15" />
            <span className="mt-2 block h-5 rounded-md bg-accent/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Photo si elle existe, sinon un visuel bleu nuit avec l'emblème et une icône. */
export function MediaFrame({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  children,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-navy-900 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="navy-surface absolute inset-0">
          <div className="tech-grid absolute inset-0" />
          <TechLines className="absolute -right-6 -bottom-6 h-[120%] opacity-70" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {children ?? <Image src="/brand/mark-transparent.png" alt="" width={96} height={96} className="size-16 opacity-90 drop-shadow-[0_0_24px_rgba(61,155,255,0.6)]" />}
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
    <span className={`inline-flex items-center justify-center bg-gradient-to-br from-brand to-navy-800 font-semibold text-white ${className}`} aria-hidden>
      {letters}
    </span>
  );
}
