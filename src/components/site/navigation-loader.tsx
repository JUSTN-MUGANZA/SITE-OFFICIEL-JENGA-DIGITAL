"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/** Délai avant d'afficher le voile : une page déjà prête s'ouvre sans clignotement. */
const SHOW_DELAY_MS = 120;
/** Sécurité : le voile disparaît quoi qu'il arrive au bout de ce délai. */
const MAX_VISIBLE_MS = 12000;

/**
 * Pendant le chargement d'une page (clic sur « Démarrer votre projet », un menu, une carte…),
 * la page s'assombrit et un cercle de points tourne au centre. Il disparaît dès que la nouvelle page s'affiche.
 */
function Loader() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = `${pathname}?${search}`;
  // Adresse de départ du chargement en cours : le voile reste tant que l'adresse n'a pas changé.
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const timers = useRef<number[]>([]);
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // La nouvelle page est affichée : on oublie le chargement (ajustement pendant le rendu, sans effet).
  if (pendingFrom !== null && pendingFrom !== current) {
    setPendingFrom(null);
    setShown(false);
  }

  useEffect(() => {
    function clear() {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    }

    function onClick(e: MouseEvent) {
      // Pas de test sur defaultPrevented : le composant Link de Next.js annule toujours le clic pour naviguer lui-même.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || !link.href || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Ancre sur la même page (#services…) : pas de chargement.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      clear();
      const from = currentRef.current;
      setPendingFrom(from);
      timers.current.push(
        window.setTimeout(() => setShown(true), SHOW_DELAY_MS),
        window.setTimeout(() => {
          setShown(false);
          setPendingFrom(null);
        }, MAX_VISIBLE_MS),
      );
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  const visible = shown && pendingFrom === current;
  if (!visible) return null;

  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 backdrop-blur-[1px] animate-[loader-in_150ms_ease-out]">
      <span className="spinner-dots" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} style={{ ["--dot" as string]: `rotate(${i * 45}deg) translateY(-14px)`, transform: `rotate(${i * 45}deg) translateY(-14px)`, animationDelay: `${(i - 8) * 0.1}s` }} />
        ))}
      </span>
      <span className="sr-only">Chargement de la page…</span>
    </div>
  );
}

export function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <Loader />
    </Suspense>
  );
}
