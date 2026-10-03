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
