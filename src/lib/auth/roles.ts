export const ROLES = ["super_admin", "editor", "sales", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  editor: "Éditeur",
  sales: "Commercial",
  viewer: "Lecteur",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Tout, y compris les utilisateurs et les paramètres du site",
  editor: "Contenu du site : projets, services, équipe, histoire, témoignages, FAQ, accueil",
  sales: "Contacts, réponses et campagnes email",
  viewer: "Consultation du dashboard, sans modification",
};

export type Permission =
  | "dashboard:view"
  | "content:edit"
  | "contacts:manage"
  | "settings:edit"
  | "users:manage";

const PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: ["dashboard:view", "content:edit", "contacts:manage", "settings:edit", "users:manage"],
  editor: ["dashboard:view", "content:edit"],
  sales: ["dashboard:view", "contacts:manage"],
  viewer: ["dashboard:view"],
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function can(role: Role | null | undefined, permission: Permission): boolean {
  return role ? PERMISSIONS[role].includes(permission) : false;
}
