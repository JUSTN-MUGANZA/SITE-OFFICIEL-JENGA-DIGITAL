"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { logAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { settingsFromForm } from "@/lib/settings/form";
import { siteSettingsSchema } from "@/lib/settings/schema";
import { SETTINGS_TAG } from "@/lib/settings/server";

export type SettingsState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveSettings(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  const user = await requireAdmin("settings:edit");
  const parsed = siteSettingsSchema.safeParse(settingsFromForm(form));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Certains champs sont invalides.", fieldErrors };
  }

  try {
    await adminDb()
      .collection("settings")
      .doc("site")
      .set({ ...parsed.data, updatedAt: FieldValue.serverTimestamp(), updatedBy: user.uid });
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Enregistrement impossible. Réessayez dans un instant." };
  }

  revalidateTag(SETTINGS_TAG, "max");
  await logAudit({ userId: user.uid, userEmail: user.email, action: "settings.update", collection: "settings", docId: "site" });
  return { status: "success", message: "Paramètres enregistrés." };
}
