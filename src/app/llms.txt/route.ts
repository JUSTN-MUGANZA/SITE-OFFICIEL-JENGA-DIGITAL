import { fr, getPublicFaqs, getPublicServices } from "@/lib/content/public";
import { listLive } from "@/lib/content/repository";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Résumé du site pour les assistants IA (https://llmstxt.org). */
export async function GET() {
  const base = siteUrl();
  const [settings, services, projects, faqs] = await Promise.all([
    getSiteSettings(),
    getPublicServices(),
    listLive("projects").catch(() => []),
    getPublicFaqs(),
  ]);
  const lines = [
    `# ${settings.agencyName}`,
    "",
    `> ${settings.tagline || "Agence digitale : création de sites web, applications, e-commerce, référencement et marketing digital."}`,
    "",
    "## Pages principales",
    `- [Accueil](${base}/)`,
    `- [Services](${base}/services)`,
    `- [Projets](${base}/realisations)`,
    `- [À propos](${base}/a-propos)`,
    `- [Notre histoire](${base}/histoire)`,
    `- [Équipe](${base}/equipe)`,
    `- [Témoignages](${base}/temoignages)`,
    `- [FAQ](${base}/faq)`,
    `- [Contact et devis](${base}/contact)`,
    "",
    "## Services",
    ...services.map((s) => `- [${fr(s.title)}](${base}/services/${s.slug}): ${fr(s.shortDescription)}`),
  ];
  if (projects.length > 0) {
    lines.push("", "## Réalisations", ...projects.map((p) => `- [${fr(p.title)}](${base}/realisations/${p.slug}): ${fr(p.summary)}`));
  }
  lines.push("", "## Questions fréquentes", ...faqs.map((f) => `- ${fr(f.question)} ${fr(f.answer).replace(/\s+/g, " ")}`));
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
