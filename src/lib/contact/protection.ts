import "server-only";
import { createHash } from "node:crypto";
import { adminDb } from "@/lib/firebase/admin";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "jenga-digital";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Limite à 5 envois par adresse IP toutes les 10 minutes.
 * Stocké dans Firestore pour fonctionner sur plusieurs serveurs sans service en plus.
 */
export async function consumeRateLimit(ipHash: string, now = Date.now()): Promise<boolean> {
  const ref = adminDb().collection("rateLimits").doc(`contact_${ipHash}`);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const windowStart = snap.get("windowStart") as number | undefined;
    const count = (snap.get("count") as number | undefined) ?? 0;
    if (!windowStart || now - windowStart > WINDOW_MS) {
      tx.set(ref, { windowStart: now, count: 1, expiresAt: new Date(now + WINDOW_MS) });
      return true;
    }
    if (count >= MAX_PER_WINDOW) return false;
    tx.update(ref, { count: count + 1 });
    return true;
  });
}

/** Vérifie le jeton Cloudflare Turnstile, si la clé est configurée. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
