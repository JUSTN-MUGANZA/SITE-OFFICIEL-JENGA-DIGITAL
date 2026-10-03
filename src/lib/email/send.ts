import "server-only";
import { Resend } from "resend";

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Envoi d'un email via Resend. Avant la vérification du domaine,
 * EMAIL_FROM peut rester sur "onboarding@resend.dev" : Resend n'envoie
 * alors qu'à l'adresse du compte Resend.
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Envoi d'emails non configuré (RESEND_API_KEY manquant)." };
  const from = process.env.EMAIL_FROM || "JENGA Digital <onboarding@resend.dev>";
  const { data, error } = await new Resend(apiKey).emails.send({ from, ...message });
  if (error || !data) return { ok: false, error: error?.message ?? "Échec de l'envoi." };
  return { ok: true, id: data.id };
}
