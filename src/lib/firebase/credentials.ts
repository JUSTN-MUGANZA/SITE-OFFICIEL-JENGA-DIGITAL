export type ServiceAccount = { projectId: string; clientEmail: string; privateKey: string };

/**
 * Identifiants du compte de service, au choix :
 * - FIREBASE_SERVICE_ACCOUNT : le fichier JSON complet téléchargé depuis Firebase ;
 * - ou FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.
 */
export function readServiceAccount(env: Record<string, string | undefined> = process.env): ServiceAccount | null {
  if (env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const json = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT) as Record<string, string>;
      if (json.project_id && json.client_email && json.private_key) {
        return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key };
      }
    } catch {
      // JSON invalide : on essaie les variables séparées.
    }
  }
  const projectId = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  // Vercel stocke les retours à la ligne de la clé sous forme de "\n" littéraux.
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return projectId && clientEmail && privateKey ? { projectId, clientEmail, privateKey } : null;
}
