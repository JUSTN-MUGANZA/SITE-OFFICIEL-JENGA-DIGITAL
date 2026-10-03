import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { adminAuth, isAdminConfigured } from "@/lib/firebase/admin";
import { can, isRole, type Permission, type Role } from "./roles";

export const SESSION_COOKIE = "__session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5; // 5 jours, maximum conseillé

export type AdminUser = {
  uid: string;
  email: string;
  name: string | null;
  role: Role;
};

/**
 * Lit et vérifie le cookie de session (signature + révocation).
 * Mis en cache pour la durée d'une requête.
 */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  // cookies() en premier : rend toujours la page dynamique, même sans configuration.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !isAdminConfigured()) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(token, true);
    if (!isRole(decoded.role) || !decoded.email) return null;
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: (decoded.name as string | undefined) ?? null,
      role: decoded.role,
    };
  } catch {
    return null;
  }
});

/** À appeler en tête de chaque page ou action admin. */
export async function requireAdmin(permission: Permission = "dashboard:view"): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  if (!can(user.role, permission)) redirect("/admin?acces=refuse");
  return user;
}

export async function setSessionCookie(value: string) {
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
