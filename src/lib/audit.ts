import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

type AuditEntry = {
  userId: string;
  userEmail: string;
  action: string;
  collection?: string;
  docId?: string;
  details?: Record<string, unknown>;
};

/** Journal d'audit : qui a fait quoi, et quand. N'interrompt jamais l'action principale. */
export async function logAudit(entry: AuditEntry) {
  try {
    await adminDb().collection("auditLog").add({ ...entry, createdAt: FieldValue.serverTimestamp() });
  } catch (error) {
    console.error("Échec de l'écriture du journal d'audit", error);
  }
}
