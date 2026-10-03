"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { ROLES, type Role } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { invitationEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSiteSettingsFresh } from "@/lib/settings/server";

export type InviteState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Lien à transmettre à la main si l'email n'a pas pu partir. */
  manualLink?: string;
};

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide"),
  role: z.enum(ROLES),
});

async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
}

export async function inviteUser(_prev: InviteState, form: FormData): Promise<InviteState> {
  const admin = await requireAdmin("users:manage");
  const parsed = inviteSchema.safeParse({ email: form.get("email"), role: form.get("role") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Données invalides." };
  const { email, role } = parsed.data;

  const auth = adminAuth();
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(email).catch(() => null);
    if (existing && typeof existing.customClaims?.role === "string") {
      return { status: "error", message: "Cette personne a déjà accès à l'administration." };
    }
    uid = existing ? existing.uid : (await auth.createUser({ email, emailVerified: false })).uid;
    await auth.setCustomUserClaims(uid, { role });
    await adminDb().collection("users").doc(uid).set({
      email,
      displayName: existing?.displayName ?? null,
      role,
      disabled: false,
      invitedBy: admin.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Impossible de créer le compte. Réessayez." };
  }

  await logAudit({ userId: admin.uid, userEmail: admin.email, action: "user.invite", collection: "users", docId: uid, details: { email, role } });
  revalidatePath("/admin/utilisateurs");

  const link = await auth.generatePasswordResetLink(email, { url: `${await siteOrigin()}/admin/login` });
  const settings = await getSiteSettingsFresh();
  const message = invitationEmail({ agencyName: settings.agencyName, role, link, invitedBy: admin.name ?? admin.email });
  const sent = await sendEmail({ to: email, ...message });
  if (!sent.ok) {
    return {
      status: "success",
      message: `Compte créé, mais l'email n'est pas parti (${sent.error}). Transmettez ce lien à ${email} :`,
      manualLink: link,
    };
  }
  return { status: "success", message: `Invitation envoyée à ${email}.` };
}

async function guardTarget(adminUid: string, uid: string) {
  if (uid === adminUid) throw new Error("Vous ne pouvez pas modifier votre propre accès.");
}

export async function changeRole(uid: string, role: Role) {
  const admin = await requireAdmin("users:manage");
  if (!ROLES.includes(role)) throw new Error("Rôle inconnu.");
  await guardTarget(admin.uid, uid);
  await adminAuth().setCustomUserClaims(uid, { role });
  // Force une reconnexion pour que le nouveau rôle s'applique tout de suite.
  await adminAuth().revokeRefreshTokens(uid);
  await adminDb().collection("users").doc(uid).update({ role });
  await logAudit({ userId: admin.uid, userEmail: admin.email, action: "user.role", collection: "users", docId: uid, details: { role } });
  revalidatePath("/admin/utilisateurs");
}

export async function setUserDisabled(uid: string, disabled: boolean) {
  const admin = await requireAdmin("users:manage");
  await guardTarget(admin.uid, uid);
  await adminAuth().updateUser(uid, { disabled });
  if (disabled) await adminAuth().revokeRefreshTokens(uid);
  await adminDb().collection("users").doc(uid).update({ disabled });
  await logAudit({ userId: admin.uid, userEmail: admin.email, action: disabled ? "user.disable" : "user.enable", collection: "users", docId: uid });
  revalidatePath("/admin/utilisateurs");
}
