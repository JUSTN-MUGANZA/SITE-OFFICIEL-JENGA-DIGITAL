import "server-only";
import { DEFAULT_FAQS, DEFAULT_PROJECTS, DEFAULT_SERVICES, DEFAULT_TEAM } from "./defaults";
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

export async function getPublicTeam() {
  const live = await listLive("team");
  return live.length > 0 ? live : DEFAULT_TEAM;
}

export async function getPublicProjects() {
  const live = await listLive("projects");
  return live.length > 0 ? live : DEFAULT_PROJECTS;
}

export async function getPublicProject(slug: string) {
  const live = await listLive("projects");
  if (live.length > 0) return getLiveBySlug("projects", slug);
  return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
}
