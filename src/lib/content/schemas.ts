import { z } from "zod";
import { SLUG_PATTERN } from "./slug";

/**
 * Modèle de données des contenus du site (voir cahier des charges).
 * Les textes affichés sont stockés en { fr, en } pour permettre l'anglais plus tard ;
 * seul le français est obligatoire.
 */
export function localized(max: number, required = true) {
  const en = z.string().trim().max(max).default("");
  if (required) return z.object({ fr: z.string().trim().min(1, "Champ obligatoire").max(max), en });
  return z.object({ fr: z.string().trim().max(max).default(""), en }).default({ fr: "", en: "" });
}

export type Localized = { fr: string; en: string };

const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https:\/\/\S+$/i.test(v) || /^\/\S+$/.test(v), "Image invalide");

const externalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Lien invalide (https://…)");

export const STATUSES = ["draft", "published", "archived"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

export const seoSchema = z.object({
  title: z.string().trim().max(70).default(""),
  description: z.string().trim().max(170).default(""),
  ogImage: imageUrl.default(""),
});

/** Champs communs à tous les contenus, modifiables depuis le formulaire. */
const editable = {
  status: z.enum(STATUSES).default("draft"),
  /** Date de publication programmée (ISO). Vide = immédiate. */
  publishAt: z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Date invalide")
    .default(""),
};

const slug = z.string().trim().regex(SLUG_PATTERN, "Adresse invalide : minuscules, chiffres et tirets uniquement").max(80);

export const projectSchema = z.object({
  ...editable,
  slug,
  title: localized(120),
  client: z.string().trim().max(120).default(""),
  sector: z.string().trim().max(80).default(""),
  year: z.coerce.number().int().min(2000).max(2100).nullable().default(null),
  summary: localized(300),
  body: localized(20000, false),
  coverImage: imageUrl.default(""),
  coverAlt: z.string().trim().max(200).default(""),
  gallery: z.array(z.object({ url: imageUrl, alt: z.string().trim().max(200).default("") })).max(30).default([]),
  serviceIds: z.array(z.string()).max(20).default([]),
  technologies: z.array(z.string().trim().max(40)).max(30).default([]),
  liveUrl: externalUrl.default(""),
  featured: z.boolean().default(false),
  seo: seoSchema.default({ title: "", description: "", ogImage: "" }),
});

export const serviceSchema = z.object({
  ...editable,
  slug,
  title: localized(100),
  icon: z.string().trim().max(40).default(""),
  shortDescription: localized(300),
  body: localized(20000, false),
  deliverables: z.array(z.string().trim().max(120)).max(30).default([]),
  startingPrice: z.string().trim().max(60).default(""),
  seo: seoSchema.default({ title: "", description: "", ogImage: "" }),
});

export const teamMemberSchema = z.object({
  ...editable,
  name: z.string().trim().min(2).max(100),
  role: localized(100),
  bio: localized(1500, false),
  photo: imageUrl.default(""),
  location: z.string().trim().max(60).default(""),
  skills: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  socials: z
    .object({ linkedin: externalUrl.default(""), x: externalUrl.default(""), github: externalUrl.default(""), website: externalUrl.default("") })
    .default({ linkedin: "", x: "", github: "", website: "" }),
});

export const historyStepSchema = z.object({
  ...editable,
  year: z.coerce.number().int().min(1900).max(2100),
  date: z.string().trim().max(40).default(""),
  title: localized(120),
  description: localized(2000, false),
  image: imageUrl.default(""),
});

export const testimonialSchema = z.object({
  ...editable,
  author: z.string().trim().min(2).max(100),
  company: z.string().trim().max(100).default(""),
  role: z.string().trim().max(100).default(""),
  quote: localized(1500),
  photo: imageUrl.default(""),
  rating: z.coerce.number().int().min(1).max(5).nullable().default(null),
  projectId: z.string().trim().max(60).default(""),
});

export const faqSchema = z.object({
  ...editable,
  question: localized(300),
  answer: localized(5000),
  category: z.string().trim().max(60).default(""),
});

export const CONTENT_SCHEMAS = {
  projects: projectSchema,
  services: serviceSchema,
  team: teamMemberSchema,
  history: historyStepSchema,
  testimonials: testimonialSchema,
  faqs: faqSchema,
} as const;

export type ContentCollection = keyof typeof CONTENT_SCHEMAS;
export const CONTENT_COLLECTIONS = Object.keys(CONTENT_SCHEMAS) as ContentCollection[];

export const COLLECTION_LABELS: Record<ContentCollection, { singular: string; plural: string }> = {
  projects: { singular: "Projet", plural: "Réalisations" },
  services: { singular: "Service", plural: "Services" },
  team: { singular: "Membre", plural: "Équipe" },
  history: { singular: "Étape", plural: "Histoire" },
  testimonials: { singular: "Témoignage", plural: "Témoignages" },
  faqs: { singular: "Question", plural: "FAQ" },
};

/** Collections dont chaque élément a sa propre page publique (et donc un slug unique). */
export const SLUGGED: readonly ContentCollection[] = ["projects", "services"];

export function isContentCollection(value: unknown): value is ContentCollection {
  return typeof value === "string" && value in CONTENT_SCHEMAS;
}

export type ContentInput<C extends ContentCollection> = z.input<(typeof CONTENT_SCHEMAS)[C]>;
export type ContentData<C extends ContentCollection> = z.output<(typeof CONTENT_SCHEMAS)[C]>;

/** Métadonnées gérées par le serveur, jamais par le formulaire. */
export type ContentMeta = {
  id: string;
  order: number;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
};

export type ContentItem<C extends ContentCollection> = ContentData<C> & ContentMeta;

/** Visible sur le site public maintenant ? */
export function isLive(item: { status: Status; publishAt: string; deletedAt: string | null }, now = Date.now()): boolean {
  if (item.status !== "published" || item.deletedAt) return false;
  return !item.publishAt || Date.parse(item.publishAt) <= now;
}

/** Contenu de la page d'accueil (document unique pages/home). */
export const homeSchema = z.object({
  hero: z.object({
    title: localized(120),
    subtitle: localized(300, false),
    ctaLabel: localized(40, false),
    ctaHref: z.string().trim().max(200).default("/contact"),
    image: imageUrl.default(""),
    /** Photos du diaporama de l'en-tête (en plus de `image`). */
    images: z.array(imageUrl).max(5).default([]),
  }),
  stats: z
    .array(z.object({ value: z.string().trim().max(20), label: localized(60) }))
    .max(6)
    .default([]),
  sections: z
    .array(
      z.object({
        key: z.enum(["services", "projects", "about", "testimonials", "team", "faq", "cta"]),
        visible: z.boolean().default(true),
      }),
    )
    .default([
      { key: "services", visible: true },
      { key: "projects", visible: true },
      { key: "about", visible: true },
      { key: "testimonials", visible: true },
      { key: "cta", visible: true },
    ]),
  about: localized(2000, false),
  seo: seoSchema.default({ title: "", description: "", ogImage: "" }),
});

export type HomeContent = z.output<typeof homeSchema>;
