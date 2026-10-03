import "server-only";
import { FieldValue, type DocumentSnapshot } from "firebase-admin/firestore";
import { revalidateTag, unstable_cache } from "next/cache";
import { adminDb, isAdminConfigured } from "@/lib/firebase/admin";
import {
  CONTENT_SCHEMAS,
  SLUGGED,
  homeSchema,
  isLive,
  type ContentCollection,
  type ContentData,
  type ContentItem,
  type HomeContent,
} from "./schemas";
import { serialize } from "./serialize";

export const contentTag = (collection: ContentCollection | "home") => `content:${collection}`;

/** Relecture du cache au moins toutes les 5 minutes, pour les publications programmées. */
const PUBLIC_REVALIDATE_SECONDS = 300;

export class ContentError extends Error {}

function toItem<C extends ContentCollection>(collection: C, snap: DocumentSnapshot): ContentItem<C> {
  const raw = serialize<Record<string, unknown>>(snap.data() ?? {});
  // On repasse par le schéma pour compléter les champs ajoutés depuis l'enregistrement.
  const parsed = CONTENT_SCHEMAS[collection].safeParse(raw);
  const data = (parsed.success ? parsed.data : raw) as ContentData<C>;
  return {
    ...data,
    id: snap.id,
    order: typeof raw.order === "number" ? raw.order : 0,
    publishedAt: (raw.publishedAt as string | null) ?? null,
    deletedAt: (raw.deletedAt as string | null) ?? null,
    createdAt: (raw.createdAt as string | null) ?? null,
    updatedAt: (raw.updatedAt as string | null) ?? null,
    updatedBy: (raw.updatedBy as string | null) ?? null,
  } as ContentItem<C>;
}

const col = (collection: ContentCollection) => adminDb().collection(collection);

// ---------- Lecture : dashboard ----------

export async function listForAdmin<C extends ContentCollection>(
  collection: C,
  { trash = false }: { trash?: boolean } = {},
): Promise<ContentItem<C>[]> {
  const snap = await col(collection).orderBy("order").get();
  return snap.docs.map((d) => toItem(collection, d)).filter((item) => Boolean(item.deletedAt) === trash);
}

export async function getForAdmin<C extends ContentCollection>(collection: C, id: string): Promise<ContentItem<C> | null> {
  const snap = await col(collection).doc(id).get();
  return snap.exists ? toItem(collection, snap) : null;
}

// ---------- Lecture : site public (en cache) ----------

async function readLive<C extends ContentCollection>(collection: C): Promise<ContentItem<C>[]> {
  if (!isAdminConfigured()) return [];
  // Tri seul côté Firestore (aucun index composite à créer), filtrage ici : les volumes sont faibles.
  const snap = await col(collection).orderBy("order").get();
  return snap.docs.map((d) => toItem(collection, d)).filter((item) => isLive(item));
}

export function listLive<C extends ContentCollection>(collection: C): Promise<ContentItem<C>[]> {
  return unstable_cache(() => readLive(collection), ["live", collection], {
    tags: [contentTag(collection)],
    revalidate: PUBLIC_REVALIDATE_SECONDS,
  })();
}

export async function getLiveBySlug<C extends ContentCollection>(collection: C, slug: string): Promise<ContentItem<C> | null> {
  const items = await listLive(collection);
  return items.find((item) => (item as { slug?: string }).slug === slug) ?? null;
}

// ---------- Écriture ----------

async function assertSlugAvailable(collection: ContentCollection, slug: string, exceptId?: string) {
  if (!SLUGGED.includes(collection)) return;
  const snap = await col(collection).where("slug", "==", slug).limit(2).get();
  if (snap.docs.some((d) => d.id !== exceptId)) {
    throw new ContentError("Cette adresse (slug) est déjà utilisée par un autre élément.");
  }
}

async function nextOrder(collection: ContentCollection): Promise<number> {
  const snap = await col(collection).orderBy("order", "desc").limit(1).get();
  const last = snap.docs[0]?.get("order");
  return typeof last === "number" ? last + 1 : 0;
}

function revalidate(collection: ContentCollection) {
  revalidateTag(contentTag(collection), "max");
}

export async function createContent<C extends ContentCollection>(collection: C, data: ContentData<C>, userId: string): Promise<string> {
  const slug = (data as { slug?: string }).slug;
  if (slug) await assertSlugAvailable(collection, slug);
  const ref = col(collection).doc();
  await ref.set({
    ...data,
    order: await nextOrder(collection),
    publishedAt: data.status === "published" ? FieldValue.serverTimestamp() : null,
    deletedAt: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: userId,
  });
  revalidate(collection);
  return ref.id;
}

export async function updateContent<C extends ContentCollection>(collection: C, id: string, data: ContentData<C>, userId: string) {
  const ref = col(collection).doc(id);
  const current = await ref.get();
  if (!current.exists) throw new ContentError("Élément introuvable.");
  const slug = (data as { slug?: string }).slug;
  if (slug) await assertSlugAvailable(collection, slug, id);
  const firstPublish = data.status === "published" && !current.get("publishedAt");
  await ref.update({
    ...data,
    ...(firstPublish ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: userId,
  });
  revalidate(collection);
}

export async function setContentStatus(collection: ContentCollection, id: string, status: ContentData<ContentCollection>["status"], userId: string) {
  const ref = col(collection).doc(id);
  const current = await ref.get();
  if (!current.exists) throw new ContentError("Élément introuvable.");
  await ref.update({
    status,
    ...(status === "published" && !current.get("publishedAt") ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: userId,
  });
  revalidate(collection);
}

/** Corbeille : l'élément disparaît du site mais reste restaurable. */
export async function trashContent(collection: ContentCollection, id: string, userId: string) {
  await col(collection).doc(id).update({ deletedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: userId });
  revalidate(collection);
}

export async function restoreContent(collection: ContentCollection, id: string, userId: string) {
  await col(collection).doc(id).update({ deletedAt: null, updatedAt: FieldValue.serverTimestamp(), updatedBy: userId });
  revalidate(collection);
}

/** Suppression définitive, uniquement depuis la corbeille. */
export async function purgeContent(collection: ContentCollection, id: string) {
  const ref = col(collection).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return;
  if (!snap.get("deletedAt")) throw new ContentError("Placez d'abord l'élément dans la corbeille.");
  await ref.delete();
  revalidate(collection);
}

/** Enregistre l'ordre d'affichage : ids dans l'ordre voulu. */
export async function reorderContent(collection: ContentCollection, ids: string[]) {
  const batch = adminDb().batch();
  ids.forEach((id, index) => batch.update(col(collection).doc(id), { order: index }));
  await batch.commit();
  revalidate(collection);
}

/** Supprime définitivement ce qui est en corbeille depuis plus de 30 jours. */
export async function purgeExpiredTrash(collection: ContentCollection, now = Date.now()): Promise<number> {
  const limit = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const snap = await col(collection).where("deletedAt", "<", limit).get();
  const batch = adminDb().batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  if (!snap.empty) await batch.commit();
  return snap.size;
}

// ---------- Page d'accueil ----------

export const DEFAULT_HOME: HomeContent = homeSchema.parse({
  hero: {
    title: { fr: "Votre agence digitale" },
    subtitle: { fr: "Sites web, applications et stratégie digitale pour faire grandir votre activité." },
    ctaLabel: { fr: "Parlons de votre projet" },
  },
});

async function readHome(): Promise<HomeContent> {
  if (!isAdminConfigured()) return DEFAULT_HOME;
  const snap = await adminDb().collection("pages").doc("home").get();
  if (!snap.exists) return DEFAULT_HOME;
  const parsed = homeSchema.safeParse(serialize(snap.data()));
  return parsed.success ? parsed.data : DEFAULT_HOME;
}

export const getHome = unstable_cache(readHome, ["home"], { tags: [contentTag("home")] });
export const getHomeFresh = readHome;

export async function saveHome(data: HomeContent, userId: string) {
  await adminDb()
    .collection("pages")
    .doc("home")
    .set({ ...data, updatedAt: FieldValue.serverTimestamp(), updatedBy: userId });
  revalidateTag(contentTag("home"), "max");
}
