import "server-only";
import { siteUrl } from "@/lib/site";

/**
 * IndexNow : prévient Bing, Yandex, Seznam et Naver dès qu'un contenu change
 * (Google ne l'utilise pas, il passe par le sitemap). Actif seulement si la variable
 * d'environnement INDEXNOW_KEY est définie et que le site a une vraie adresse publique.
 */
export function indexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && /^[a-zA-Z0-9-]{8,128}$/.test(key) ? key : null;
}

/** Envoie les adresses modifiées. Ne bloque jamais l'enregistrement : les erreurs sont ignorées. */
export function pingIndexNow(paths: string[]): void {
  const key = indexNowKey();
  const base = siteUrl();
  if (!key || base.startsWith("http://localhost")) return;
  const host = new URL(base).host;
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${base}/indexnow.txt`,
      urlList: [...new Set(paths)].map((p) => `${base}${p === "/" ? "" : p}`),
    }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {});
}
