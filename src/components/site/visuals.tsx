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
