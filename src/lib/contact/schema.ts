import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom").max(100),
  email: z.string().trim().toLowerCase().email("Adresse email invalide").max(200),
  phone: z.string().trim().max(40).default(""),
  company: z.string().trim().max(120).default(""),
  subject: z.string().trim().max(150).default(""),
  serviceId: z.string().trim().max(64).default(""),
  message: z.string().trim().min(10, "Votre message est un peu court (10 caractères minimum)").max(5000),
  consentMarketing: z.boolean().default(false),
  sourcePage: z.string().trim().max(200).default(""),
  /** Champ piège invisible : un humain le laisse vide. */
  website: z.string().max(200).default(""),
  /** Horodatage (ms) de l'affichage du formulaire, pour repérer les envois instantanés. */
  startedAt: z.number().int().nonnegative().optional(),
  turnstileToken: z.string().max(4000).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;

const MIN_FILL_MS = 3000;

/** Indices de robot qui ne demandent aucun service externe. */
export function looksLikeBot(input: ContactMessage, now = Date.now()): boolean {
  if (input.website.trim() !== "") return true;
  if (input.startedAt !== undefined && now - input.startedAt < MIN_FILL_MS) return true;
  const links = input.message.match(/https?:\/\//gi)?.length ?? 0;
  return links > 3;
}
