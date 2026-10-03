import "server-only";
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { contactAcknowledgementEmail, contactNotificationEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { adminDb } from "@/lib/firebase/admin";
import { getSiteSettingsFresh } from "@/lib/settings/server";
import type { ContactMessage } from "./schema";

/** Un contact par adresse email : l'identifiant est dérivé de l'adresse. */
export function contactIdFor(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
}

/**
 * Enregistre la demande (contact + message), prévient l'agence par email
 * et envoie un accusé de réception au visiteur.
 */
export async function submitContact(input: ContactMessage, ipHash: string): Promise<{ contactId: string; messageId: string }> {
  const db = adminDb();
  const contactId = contactIdFor(input.email);
  const contactRef = db.collection("contacts").doc(contactId);
  const messageRef = contactRef.collection("messages").doc();

  let serviceName = "";
  if (input.serviceId) {
    const service = await db.collection("services").doc(input.serviceId).get().catch(() => null);
    serviceName = (service?.get("title.fr") as string | undefined) ?? "";
  }

  await db.runTransaction(async (tx) => {
    const existing = await tx.get(contactRef);
    tx.set(
      contactRef,
      {
        name: input.name,
        email: input.email,
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.company ? { company: input.company } : {}),
        // Le consentement n'est jamais retiré par un nouveau message ; seulement par la désinscription.
        ...(input.consentMarketing ? { consentMarketing: true, consentAt: FieldValue.serverTimestamp() } : {}),
        // Champs initialisés uniquement à la création du contact.
        ...(existing.exists
          ? {}
          : { createdAt: FieldValue.serverTimestamp(), tags: [], unsubscribed: false, bounced: false, assignedTo: null, consentMarketing: input.consentMarketing }),
        status: "new",
        lastServiceId: input.serviceId || null,
        lastSourcePage: input.sourcePage || null,
        lastMessageAt: FieldValue.serverTimestamp(),
        messageCount: FieldValue.increment(1),
        ipHash,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    tx.set(messageRef, {
      direction: "in",
      subject: input.subject,
      body: input.message,
      serviceId: input.serviceId || null,
      sourcePage: input.sourcePage || null,
      status: "received",
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.set(db.collection("notifications").doc(), {
      type: "contact.new",
      title: `Nouveau message de ${input.name}`,
      link: `/admin/contacts/${contactId}`,
      readBy: [],
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  const settings = await getSiteSettingsFresh();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? null;

  const notification = await sendEmail({
    to: settings.contactRecipientEmail,
    replyTo: input.email,
    ...contactNotificationEmail({
      agencyName: settings.agencyName,
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      subject: input.subject,
      serviceName,
      message: input.message,
      sourcePage: input.sourcePage,
      dashboardUrl: site ? `${site}/admin/contacts/${contactId}` : null,
    }),
  });
  await messageRef.update({
    notification: notification.ok
      ? { status: "sent", resendId: notification.id }
      : { status: "failed", error: notification.error },
  });
  if (!notification.ok) console.error("Notification de contact non envoyée :", notification.error);

  // L'accusé de réception exige un domaine vérifié dans Resend (sinon Resend refuse
  // d'écrire à une autre adresse que celle du compte).
  if (!(process.env.EMAIL_FROM ?? "").includes("resend.dev")) {
    const ack = await sendEmail({
      to: input.email,
      replyTo: settings.email || undefined,
      ...contactAcknowledgementEmail({ agencyName: settings.agencyName, name: input.name, message: input.message }),
    });
    if (!ack.ok) console.error("Accusé de réception non envoyé :", ack.error);
  }

  return { contactId, messageId: messageRef.id };
}
