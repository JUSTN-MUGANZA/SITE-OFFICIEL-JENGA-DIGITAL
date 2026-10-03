import { NextResponse } from "next/server";
import { describeServiceAccount } from "@/lib/firebase/credentials";

export const dynamic = "force-dynamic";

/** Message d'erreur sans adresse e-mail ni détail sensible, tronqué. */
function safeMessage(error: unknown): string {
  const raw = error instanceof Error ? `${(error as { code?: string }).code ?? error.name}: ${error.message}` : String(error);
  return raw.replace(/[\w.+-]+@[\w.-]+/g, "[e-mail]").slice(0, 600);
}

async function check(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
    return "ok";
  } catch (error) {
    return safeMessage(error);
  }
}

/**
 * Diagnostic de la configuration du serveur : dit si la clé Firebase est lisible
 * et si Firestore et Firebase Auth répondent. Ne renvoie aucun secret.
 * Le SDK Firebase Admin est chargé ici à la demande pour que même une erreur
 * de chargement du module apparaisse dans la réponse.
 */
export async function GET() {
  const credentials = describeServiceAccount();
  let firestore = "non testé";
  let auth = "non testé";
  let sdk = "ok";
  try {
    const { adminAuth, adminDb } = await import("@/lib/firebase/admin");
    if (credentials === "ok") {
      [firestore, auth] = await Promise.all([
        check(() => adminDb().collection("settings").doc("site").get()),
        check(() => adminAuth().listUsers(1)),
      ]);
    }
  } catch (error) {
    sdk = safeMessage(error);
  }

  return NextResponse.json(
    {
      cleFirebase: credentials,
      chargementFirebaseAdmin: sdk,
      firestore,
      authentification: auth,
      node: process.version,
      adresseDeContact: Boolean(process.env.CONTACT_EMAIL),
      superAdmin: Boolean(process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL),
      envoiEmails: Boolean(process.env.RESEND_API_KEY),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
