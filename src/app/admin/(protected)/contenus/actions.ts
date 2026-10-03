"use server";

import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/session";
import {
  ContentError,
  createContent,
  purgeContent,
  reorderContent,
  restoreContent,
  saveHome,
  setContentStatus,
  trashContent,
  updateContent,
} from "@/lib/content/repository";
import { CONTENT_SCHEMAS, STATUSES, homeSchema, isContentCollection, type ContentCollection, type Status } from "@/lib/content/schemas";
import { fieldErrorsOf, type ActionResult } from "@/lib/forms/result";

function assertCollection(value: unknown): ContentCollection {
  if (!isContentCollection(value)) throw new Error("Collection inconnue.");
  return value;
}

const idSchema = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/);

async function guarded<T>(task: () => Promise<T>, success?: string): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await task(), message: success };
  } catch (error) {
    if (error instanceof ContentError) return { ok: false, message: error.message };
    console.error(error);
    return { ok: false, message: "L'opération a échoué. Réessayez dans un instant." };
  }
}

/** Crée (id null) ou modifie un contenu après validation complète. */
export async function saveContent(collectionName: string, id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  const parsed = CONTENT_SCHEMAS[collection].safeParse(input);
  if (!parsed.success) return { ok: false, message: "Certains champs sont invalides.", fieldErrors: fieldErrorsOf(parsed.error) };

  return guarded(async () => {
    let savedId: string;
    if (id) {
      savedId = idSchema.parse(id);
      await updateContent(collection, savedId, parsed.data, user.uid);
    } else {
      savedId = await createContent(collection, parsed.data, user.uid);
    }
    await logAudit({ userId: user.uid, userEmail: user.email, action: id ? "content.update" : "content.create", collection, docId: savedId });
    return { id: savedId };
  }, "Enregistré.");
}

export async function changeContentStatus(collectionName: string, id: string, status: Status): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  if (!STATUSES.includes(status)) return { ok: false, message: "Statut inconnu." };
  return guarded(async () => {
    await setContentStatus(collection, idSchema.parse(id), status, user.uid);
    await logAudit({ userId: user.uid, userEmail: user.email, action: `content.${status}`, collection, docId: id });
    return undefined;
  });
}

export async function moveContentToTrash(collectionName: string, id: string): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  return guarded(async () => {
    await trashContent(collection, idSchema.parse(id), user.uid);
    await logAudit({ userId: user.uid, userEmail: user.email, action: "content.trash", collection, docId: id });
    return undefined;
  }, "Déplacé dans la corbeille (restaurable pendant 30 jours).");
}

export async function restoreContentFromTrash(collectionName: string, id: string): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  return guarded(async () => {
    await restoreContent(collection, idSchema.parse(id), user.uid);
    await logAudit({ userId: user.uid, userEmail: user.email, action: "content.restore", collection, docId: id });
    return undefined;
  }, "Restauré.");
}

export async function deleteContentForever(collectionName: string, id: string): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  return guarded(async () => {
    await purgeContent(collection, idSchema.parse(id));
    await logAudit({ userId: user.uid, userEmail: user.email, action: "content.delete", collection, docId: id });
    return undefined;
  }, "Supprimé définitivement.");
}

export async function saveContentOrder(collectionName: string, ids: string[]): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const collection = assertCollection(collectionName);
  const parsed = z.array(idSchema).max(500).safeParse(ids);
  if (!parsed.success) return { ok: false, message: "Ordre invalide." };
  return guarded(async () => {
    await reorderContent(collection, parsed.data);
    await logAudit({ userId: user.uid, userEmail: user.email, action: "content.reorder", collection });
    return undefined;
  }, "Ordre enregistré.");
}

export async function saveHomeContent(input: unknown): Promise<ActionResult> {
  const user = await requireAdmin("content:edit");
  const parsed = homeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Certains champs sont invalides.", fieldErrors: fieldErrorsOf(parsed.error) };
  return guarded(async () => {
    await saveHome(parsed.data, user.uid);
    await logAudit({ userId: user.uid, userEmail: user.email, action: "content.home", collection: "pages", docId: "home" });
    return undefined;
  }, "Page d'accueil enregistrée.");
}
