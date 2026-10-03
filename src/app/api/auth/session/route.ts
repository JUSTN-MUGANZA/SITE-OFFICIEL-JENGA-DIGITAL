import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { logAudit } from "@/lib/audit";
import { isBootstrapEmail } from "@/lib/auth/bootstrap";
import { isRole } from "@/lib/auth/roles";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, clearSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { adminAuth, adminDb, isAdminConfigured } from "@/lib/firebase/admin";

const RECENT_SIGN_IN_SECONDS = 5 * 60;

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

function error(message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/** Échange un jeton Firebase (après connexion) contre un cookie de session httpOnly. */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return error("Origine refusée.", 403);
  if (!isAdminConfigured()) return error("Le serveur n'est pas encore configuré (Firebase Admin).", 503);

  const body = (await request.json().catch(() => null)) as { idToken?: unknown } | null;
  if (typeof body?.idToken !== "string") return error("Requête invalide.", 400);

  const auth = adminAuth();
  let decoded;
  try {
    decoded = await auth.verifyIdToken(body.idToken, true);
  } catch {
    return error("Connexion expirée, veuillez réessayer.", 401);
  }

  if (Date.now() / 1000 - decoded.auth_time > RECENT_SIGN_IN_SECONDS) {
    return error("Connexion trop ancienne, veuillez vous reconnecter.", 401);
  }

  if (!isRole(decoded.role)) {
    if (isBootstrapEmail(decoded.email, decoded.email_verified)) {
      await auth.setCustomUserClaims(decoded.uid, { role: "super_admin" });
      await adminDb().collection("users").doc(decoded.uid).set(
        {
          email: decoded.email,
          displayName: decoded.name ?? null,
          role: "super_admin",
          disabled: false,
          invitedBy: null,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      // Le rôle n'apparaît que dans un nouveau jeton : le navigateur doit le rafraîchir.
      return error("Rôle attribué, rafraîchissement nécessaire.", 409, { refresh: true });
    }

    // Compte non invité (souvent une connexion Google spontanée) : on ne le garde pas.
    const invited = await adminDb().collection("users").doc(decoded.uid).get();
    if (!invited.exists) await auth.deleteUser(decoded.uid).catch(() => undefined);
    return error("Ce compte n'a pas accès à l'administration. Demandez une invitation.", 403);
  }

  const sessionCookie = await auth.createSessionCookie(body.idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  });
  await setSessionCookie(sessionCookie);

  await adminDb()
    .collection("users")
    .doc(decoded.uid)
    .set({ lastLoginAt: FieldValue.serverTimestamp(), displayName: decoded.name ?? null }, { merge: true });
  await logAudit({ userId: decoded.uid, userEmail: decoded.email ?? "", action: "login" });

  return NextResponse.json({ ok: true });
}

/** Déconnexion : supprime le cookie et révoque les sessions de l'utilisateur. */
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return error("Origine refusée.", 403);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && isAdminConfigured()) {
    try {
      const decoded = await adminAuth().verifySessionCookie(token);
      await adminAuth().revokeRefreshTokens(decoded.sub);
    } catch {
      // Cookie déjà invalide : rien à révoquer.
    }
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
