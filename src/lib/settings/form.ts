import { SOCIAL_NETWORKS, type SiteSettings } from "./schema";

/** Transforme le formulaire du dashboard en objet à valider. */
export function settingsFromForm(form: FormData): Record<keyof SiteSettings, unknown> {
  const str = (key: string) => String(form.get(key) ?? "");
  const links = str("links")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: (label ?? "").trim(), url: rest.join("|").trim() };
    });
  return {
    agencyName: str("agencyName"),
    tagline: str("tagline"),
    logoUrl: str("logoUrl"),
    faviconUrl: str("faviconUrl"),
    email: str("email"),
    contactRecipientEmail: str("contactRecipientEmail"),
    phone: str("phone"),
    address: str("address"),
    mapsUrl: str("mapsUrl"),
    hours: str("hours"),
    socials: Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, str(`socials.${n}`)])),
    links,
    footerText: str("footerText"),
    maintenance: form.get("maintenance") === "on",
  };
}

export function linksToText(links: SiteSettings["links"]): string {
  return links.map((l) => `${l.label} | ${l.url}`).join("\n");
}
