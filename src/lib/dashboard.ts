import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export type DashboardCounts = { projects: number; services: number; contacts: number; unread: number };

async function count(collection: string, unreadOnly = false): Promise<number> {
  try {
    let query: FirebaseFirestore.Query = adminDb().collection(collection);
    if (unreadOnly) query = query.where("status", "==", "new");
    const snap = await query.count().get();
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const [projects, services, contacts, unread] = await Promise.all([
    count("projects"),
    count("services"),
    count("contacts"),
    count("contacts", true),
  ]);
  return { projects, services, contacts, unread };
}

export type ActivityEntry = { id: string; action: string; userEmail: string; createdAt: Date | null };

export async function getRecentActivity(limit = 8): Promise<ActivityEntry[]> {
  try {
    const snap = await adminDb().collection("auditLog").orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        action: String(data.action ?? ""),
        userEmail: String(data.userEmail ?? ""),
        createdAt: data.createdAt?.toDate?.() ?? null,
      };
    });
  } catch {
    return [];
  }
}

export const ACTION_LABELS: Record<string, string> = {
  login: "s'est connecté",
  "settings.update": "a modifié les paramètres du site",
  "user.invite": "a invité un utilisateur",
  "user.role": "a changé le rôle d'un utilisateur",
  "user.disable": "a désactivé un utilisateur",
  "user.enable": "a réactivé un utilisateur",
};

export type RecentContact = {
  id: string;
  name: string;
  email: string;
  unread: boolean;
  subject: string;
  preview: string;
  at: Date | null;
};

/** Derniers contacts ayant écrit, avec un aperçu de leur dernier message. */
export async function getRecentContacts(limit = 4): Promise<RecentContact[]> {
  try {
    const snap = await adminDb().collection("contacts").orderBy("lastMessageAt", "desc").limit(limit).get();
    return await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data();
        const last = await doc.ref.collection("messages").orderBy("createdAt", "desc").limit(1).get().catch(() => null);
        const message = last?.docs[0]?.data();
        return {
          id: doc.id,
          name: String(data.name ?? ""),
          email: String(data.email ?? ""),
          unread: data.status === "new",
          subject: String(message?.subject || "Formulaire de contact"),
          preview: String(message?.body ?? "").slice(0, 140),
          at: data.lastMessageAt?.toDate?.() ?? null,
        };
      }),
    );
  } catch {
    return [];
  }
}

/** Nouveaux contacts par jour sur les `days` derniers jours (du plus ancien au plus récent). */
export async function getContactsPerDay(days = 30, now = new Date()): Promise<{ day: Date; count: number }[]> {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
  const buckets = Array.from({ length: days }, (_, i) => ({ day: new Date(start.getFullYear(), start.getMonth(), start.getDate() + i), count: 0 }));
  try {
    const snap = await adminDb().collection("contacts").where("createdAt", ">=", start).select("createdAt").get();
    for (const doc of snap.docs) {
      const created: Date | undefined = doc.get("createdAt")?.toDate?.();
      if (!created) continue;
      const index = Math.floor((created.getTime() - start.getTime()) / 86_400_000);
      if (index >= 0 && index < days) buckets[index].count++;
    }
  } catch {
    // Pas de base configurée : courbe vide.
  }
  return buckets;
}

/** Nombre de notifications que cet administrateur n'a pas encore lues. */
export async function countUnreadNotifications(uid: string): Promise<number> {
  try {
    const snap = await adminDb().collection("notifications").orderBy("createdAt", "desc").limit(50).get();
    return snap.docs.filter((d) => !((d.get("readBy") as string[] | undefined) ?? []).includes(uid)).length;
  } catch {
    return 0;
  }
}
