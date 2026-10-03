import type { MetadataRoute } from "next";
import { getPublicServices } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";
import { siteUrl } from "@/lib/site";

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/realisations", priority: 0.9 },
  { path: "/a-propos", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/faq", priority: 0.6 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/confidentialite", priority: 0.2 },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [services, projects] = await Promise.all([getPublicServices(), listLive("projects").catch(() => [])]);
  const at = (date: string | null) => (date ? new Date(date) : undefined);
  return [
    ...STATIC_PAGES.map((p) => ({ url: `${base}${p.path === "/" ? "" : p.path}`, priority: p.priority })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: at(s.updatedAt), priority: 0.8 })),
    ...projects.map((p) => ({ url: `${base}/realisations/${p.slug}`, lastModified: at(p.updatedAt), priority: 0.7 })),
  ];
}
