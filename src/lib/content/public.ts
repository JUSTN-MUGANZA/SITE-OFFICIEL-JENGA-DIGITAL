import "server-only";
import { DEFAULT_FAQS, DEFAULT_HISTORY, DEFAULT_SERVICES } from "./defaults";
import { getLiveBySlug, listLive } from "./repository";
import type { Localized } from "./schemas";

/** Texte français (l'anglais viendra plus tard). */
export const fr = (value: Localized | undefined) => value?.fr ?? "";

export async function getPublicServices() {
  const live = await listLive("services");
  return live.length > 0 ? live : DEFAULT_SERVICES;
}

export async function getPublicService(slug: string) {
  const live = await listLive("services");
  if (live.length > 0) return getLiveBySlug("services", slug);
  return DEFAULT_SERVICES.find((s) => s.slug === slug) ?? null;
}

export async function getPublicFaqs() {
  const live = await listLive("faqs");
  return live.length > 0 ? live : DEFAULT_FAQS;
}

export async function getPublicHistory() {
  const live = await listLive("history");
  return live.length > 0 ? live : DEFAULT_HISTORY;
}
