/**
 * Le tout premier super admin ne peut pas être invité par quelqu'un.
 * L'adresse définie dans BOOTSTRAP_SUPER_ADMIN_EMAIL reçoit ce rôle à sa
 * première connexion, à condition que l'adresse soit vérifiée.
 */
export function isBootstrapEmail(email: string | undefined, verified: boolean | undefined, configured = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL): boolean {
  if (!email || !verified || !configured) return false;
  return configured
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
