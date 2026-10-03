import "server-only";
import { unstable_cache } from "next/cache";
import { adminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { withDefaults, type SiteSettings } from "./schema";

export const SETTINGS_TAG = "site-settings";

async function readSettings(): Promise<SiteSettings> {
  const fallback = process.env.CONTACT_EMAIL ?? "";
  if (!isAdminConfigured()) return withDefaults(undefined, fallback);
  const snap = await adminDb().collection("settings").doc("site").get();
  return withDefaults(snap.data() as Partial<SiteSettings> | undefined, fallback);
}

/** Paramètres pour le site public, en cache jusqu'à la prochaine modification. */
export const getSiteSettings = unstable_cache(readSettings, ["site-settings"], { tags: [SETTINGS_TAG] });

/** Paramètres frais, pour le dashboard. */
export const getSiteSettingsFresh = readSettings;
