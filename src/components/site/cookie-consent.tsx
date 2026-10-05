"use client";

import { Cookie, MapPin } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

/**
 * Consentement aux cookies : « tout accepter » ou « tout refuser ».
 * Le site lui-même ne dépose aucun cookie publicitaire ni de mesure d'audience ; le choix porte sur les
 * services tiers (aujourd'hui la carte Google Maps de la page Contact), qui ne se chargent qu'après accord.
 */
const CONSENT_KEY = "jenga-consent";
const CHANGE_EVENT = "jenga-consent-change";

export type Consent = "accepted" | "refused";

/** Instantané sous forme de texte (stable pour useSyncExternalStore) : « choix:bandeau rouvert ». */
function read(): string {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    const open = sessionStorage.getItem(`${CONSENT_KEY}-open`) === "1";
    return `${v === "accepted" || v === "refused" ? v : "unset"}:${open ? 1 : 0}`;
  } catch {
    return "unset:0";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useConsentState() {
  // Côté serveur, rien n'est affiché : le bandeau apparaît une fois la page chargée.
  const snap = useSyncExternalStore(subscribe, read, () => "ssr:0");
  const [choice, open] = snap.split(":");
  return { choice: choice as Consent | "unset" | "ssr", open: open === "1" };
}

function save(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    sessionStorage.removeItem(`${CONSENT_KEY}-open`);
  } catch {
    // Stockage indisponible : le choix vaut pour cette page seulement.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function reopen() {
  try {
    sessionStorage.setItem(`${CONSENT_KEY}-open`, "1");
  } catch {
    // Sans stockage, le bandeau réapparaît de toute façon à la prochaine visite.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function CookieBanner() {
  const { choice, open } = useConsentState();
  if (choice !== "unset" && !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl animate-rise rounded-2xl bg-surface p-5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-border sm:inset-x-6 sm:bottom-6 sm:p-7"
    >
      <div className="flex gap-4">
        <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand sm:inline-flex">
          <Cookie className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-base font-semibold text-ink sm:text-lg">
            Votre vie privée, votre choix
          </h2>
          <div id="cookie-text" className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              Notre site n&apos;utilise <strong className="font-semibold text-ink">aucun cookie publicitaire</strong> ni de mesure d&apos;audience.
              Il garde seulement en mémoire, sur votre appareil, vos préférences d&apos;affichage (mode clair ou sombre) et votre choix ci-dessous.
            </p>
            <p>
              Avec votre accord, nous affichons aussi des <strong className="font-semibold text-ink">services tiers</strong>, comme la carte
              Google Maps de la page Contact, qui peuvent déposer leurs propres cookies. Vous pouvez changer d&apos;avis à tout moment depuis le
              lien « Gérer les cookies » en bas de page.{" "}
              <Link href="/confidentialite#cookies" className="font-medium text-brand underline-offset-4 hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => save("refused")}
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-border-strong transition hover:bg-muted"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => save("accepted")}
              className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lien du pied de page pour revoir son choix. */
export function ManageCookiesButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={reopen} className={className}>
      Gérer les cookies
    </button>
  );
}

/** Carte Google Maps chargée seulement si le visiteur a accepté les services tiers. */
export function ConsentMap({ address }: { address: string }) {
  const { choice } = useConsentState();
  const query = encodeURIComponent(address);
  if (choice === "accepted") {
    return (
      <iframe
        title={`Carte : ${address}`}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[16/10] w-full border-b border-border"
      />
    );
  }
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 border-b border-border bg-muted px-6 text-center">
      <MapPin className="size-6 text-brand" aria-hidden />
      <p className="text-sm font-medium text-ink">{address}</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        <button type="button" onClick={() => save("accepted")} className="font-semibold text-brand hover:underline">
          Afficher la carte
        </button>
        <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-ink">
          Ouvrir dans Google Maps
        </a>
      </div>
      <p className="text-xs text-muted-foreground">La carte Google peut déposer des cookies.</p>
    </div>
  );
}
