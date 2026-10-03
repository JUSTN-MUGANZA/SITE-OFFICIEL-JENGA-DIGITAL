import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function clientApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let authPromise: Promise<Auth> | null = null;

/**
 * Firebase Auth côté navigateur. La session réelle vit dans un cookie httpOnly
 * posé par le serveur : on ne garde donc rien dans le navigateur (in-memory).
 */
export function clientAuth(): Promise<Auth> {
  if (!authPromise) {
    const auth = getAuth(clientApp());
    auth.languageCode = "fr";
    authPromise = setPersistence(auth, inMemoryPersistence).then(() => auth);
  }
  return authPromise;
}
