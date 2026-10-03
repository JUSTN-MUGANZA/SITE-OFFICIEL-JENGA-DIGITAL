import type { MetadataRoute } from "next";

/**
 * Moteurs de recherche et assistants IA sont explicitement autorisés,
 * l'administration et l'API sont exclues partout.
 */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/"];
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: site ? `${site}/sitemap.xml` : undefined,
  };
}
