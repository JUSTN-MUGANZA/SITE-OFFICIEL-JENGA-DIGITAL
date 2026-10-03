import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { describeServiceAccount } from "@/lib/firebase/credentials";

export const dynamic = "force-dynamic";

/** Message d'erreur sans adresse e-mail ni détail sensible, tronqué. */
function safeMessage(error: unknown): string {
  const raw = error instanceof Error ? `${(error as { code?: string }).code ?? error.name}: ${error.message}` : String(error);
  return raw.replace(/[\w.+-]+@[\w.-]+/g, "[e-mail]").slice(0, 300);
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
 */
export async function GET() {
  const credentials = describeServiceAccount();
  const ready = credentials === "ok";
  const [firestore, auth] = ready
    ? await Promise.all([
        check(() => adminDb().collection("settings").doc("site").get()),
        check(() => adminAuth().listUsers(1)),
      ])
    : ["non testé", "non testé"];

  return NextResponse.json(
    {
      cleFirebase: credentials,
      firestore,
      authentification: auth,
      adresseDeContact: Boolean(process.env.CONTACT_EMAIL),
      superAdmin: Boolean(process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL),
      envoiEmails: Boolean(process.env.RESEND_API_KEY),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
