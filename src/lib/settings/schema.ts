import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Lien invalide (doit commencer par https://)");

const optionalText = (max: number) => z.string().trim().max(max);

export const SOCIAL_NETWORKS = ["facebook", "instagram", "linkedin", "x", "tiktok", "youtube", "whatsapp"] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  tiktok: "TikTok",
  youtube: "YouTube",
  whatsapp: "WhatsApp (lien wa.me)",
};

export const siteSettingsSchema = z.object({
  agencyName: z.string().trim().min(2, "Nom trop court").max(80),
  tagline: optionalText(160),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  email: z.string().trim().email("Adresse email invalide"),
  contactRecipientEmail: z.string().trim().email("Adresse email invalide"),
  phone: optionalText(40),
  address: optionalText(300),
  mapsUrl: optionalUrl,
  hours: optionalText(300),
  socials: z.object(
    Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, optionalUrl])) as Record<SocialNetwork, typeof optionalUrl>,
  ),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Libellé manquant").max(60),
        // Lien interne (/page) ou externe (https://…) uniquement : jamais de javascript:
        url: z
          .string()
          .trim()
          .max(500)
          .refine((v) => /^\/(?!\/)\S*$/.test(v) || /^https?:\/\/\S+$/i.test(v), "Lien invalide (commence par / ou https://)"),
      }),
    )
    .max(12),
  footerText: optionalText(500),
  maintenance: z.boolean(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SETTINGS: SiteSettings = {
  agencyName: "JENGA Digital",
  tagline: "",
  logoUrl: "",
  faviconUrl: "",
  email: "",
  contactRecipientEmail: "",
  phone: "",
  address: "",
  mapsUrl: "",
  hours: "",
  socials: Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, ""])) as Record<SocialNetwork, string>,
  links: [],
  footerText: "",
  maintenance: false,
};

/** Fusionne un document Firestore (éventuellement partiel ou ancien) avec les valeurs par défaut. */
export function withDefaults(data: Partial<SiteSettings> | undefined, fallbackEmail = ""): SiteSettings {
  const merged: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...data,
    socials: { ...DEFAULT_SETTINGS.socials, ...(data?.socials ?? {}) },
    links: data?.links ?? [],
  };
  if (!merged.contactRecipientEmail) merged.contactRecipientEmail = fallbackEmail;
  if (!merged.email) merged.email = fallbackEmail;
  return merged;
}
