import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence, type Auth } from "firebase/auth";

// Configuration Web du projet Firebase « site-officiel-jenga-digital ».
// Ces valeurs sont publiques par nature (envoyées à chaque visiteur) ; la sécurité
// repose sur les règles Firestore et la vérification côté serveur. Les variables
// NEXT_PUBLIC_FIREBASE_* permettent de pointer vers un autre projet (tests).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBWDgpAWybyZc4ef7seweUpvmlgKrY1Iq4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "site-officiel-jenga-digital.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "site-officiel-jenga-digital",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "site-officiel-jenga-digital.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "90802794273",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:90802794273:web:df9c1359743cb97afc5860",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VF4CC2BBDD",
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
