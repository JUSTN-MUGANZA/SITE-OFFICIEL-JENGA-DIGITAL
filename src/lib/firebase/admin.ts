import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function adminApp(): App {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel stocke les retours à la ligne de la clé sous forme de "\n" littéraux.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin non configuré : FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY sont requis.",
    );
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY,
  );
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => getFirestore(adminApp());
