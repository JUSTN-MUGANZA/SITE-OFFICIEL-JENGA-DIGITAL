"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Change d'élément toutes les `delay` ms. Quand le visiteur préfère moins
 * d'animations, le contenu change toujours, mais sans effet de transition.
 */
function useCycle(length: number, delay: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), delay);
    return () => window.clearInterval(id);
  }, [length, delay]);
  return [index, setIndex] as const;
}

/**
 * Mots qui défilent dans le titre. Tous les mots occupent la même case,
 * pour que le titre ne saute pas quand le mot change.
 */
export function RotatingWords({ words, className = "" }: { words: string[]; className?: string }) {
  const [index] = useCycle(words.length, 2800);
  return (
    <span className={`inline-grid align-top ${className}`}>
      <span className="sr-only">{words[0]}</span>
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden
          className={`col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none ${
            i === index ? "translate-y-0 opacity-100" : i === (index + words.length - 1) % words.length ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0"
          }`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/** Diaporama en fondu enchaîné pour les photos de l'en-tête. */
export function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useCycle(images.length, 5000);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted-strong shadow-[var(--shadow-lift)]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={`object-cover transition-opacity duration-1000 motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1} sur ${images.length}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-1.5 rounded-full bg-white shadow transition-all ${i === index ? "w-6" : "w-1.5 opacity-60 hover:opacity-100"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
