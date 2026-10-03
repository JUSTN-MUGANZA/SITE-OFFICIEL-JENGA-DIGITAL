import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, isRole, type Role } from "@/lib/auth/roles";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { InviteForm } from "./invite-form";
import { UserRow } from "./user-row";

export const metadata: Metadata = { title: "Utilisateurs" };

type UserDoc = { id: string; email: string; displayName: string | null; role: Role; disabled: boolean; lastLoginAt: Date | null };

async function listUsers(): Promise<UserDoc[]> {
  const snap = await adminDb().collection("users").orderBy("email").get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      email: String(d.email ?? ""),
      displayName: d.displayName ?? null,
      role: isRole(d.role) ? d.role : "viewer",
      disabled: Boolean(d.disabled),
      lastLoginAt: d.lastLoginAt?.toDate?.() ?? null,
    };
  });
}

export default async function UsersPage() {
  const me = await requireAdmin("users:manage");
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          Seules les personnes invitées peuvent se connecter à l&apos;administration.
        </p>
      </header>

      <Card title="Inviter une personne">
        <InviteForm />
        <dl className="mt-5 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {ROLES.map((role) => (
            <div key={role}>
              <dt className="inline font-medium text-foreground">{ROLE_LABELS[role]} : </dt>
              <dd className="inline">{ROLE_DESCRIPTIONS[role]}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title={`Comptes (${users.length})`}>
        <ul className="divide-y divide-border">
          {users.map((u) => (
            <UserRow
              key={u.id}
              uid={u.id}
              email={u.email}
              name={u.displayName}
              role={u.role}
              disabled={u.disabled}
              lastLogin={u.lastLoginAt ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(u.lastLoginAt) : null}
              isSelf={u.id === me.uid}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
