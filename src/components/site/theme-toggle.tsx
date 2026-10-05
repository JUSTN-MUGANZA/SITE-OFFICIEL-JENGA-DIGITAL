"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";

/** Bouton soleil / lune : bascule entre clair et sombre et retient le choix sur cet appareil. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour cette page seulement.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex size-11 items-center justify-center rounded-lg text-ink transition hover:bg-muted ${className}`}
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <span className="sr-only">Passer en mode clair ou sombre</span>
    </button>
  );
}
