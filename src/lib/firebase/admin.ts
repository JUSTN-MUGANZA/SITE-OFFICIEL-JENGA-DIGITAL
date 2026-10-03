import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readServiceAccount } from "./credentials";

function adminApp(): App {
  if (getApps().length) return getApp();
  const account = readServiceAccount();
  if (!account) {
    throw new Error(
      "Firebase Admin non configuré : renseignez FIREBASE_SERVICE_ACCOUNT, ou FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY.",
    );
  }
  return initializeApp({ credential: cert(account) });
}

export function isAdminConfigured(): boolean {
  return readServiceAccount() !== null;
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => getFirestore(adminApp());
