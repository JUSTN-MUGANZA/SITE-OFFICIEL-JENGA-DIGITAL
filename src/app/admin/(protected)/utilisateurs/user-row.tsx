"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { selectClass } from "@/components/ui/field";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/auth/roles";
import { changeRole, setUserDisabled } from "./actions";

type Props = {
  uid: string;
  email: string;
  name: string | null;
  role: Role;
  disabled: boolean;
  lastLogin: string | null;
  isSelf: boolean;
};

export function UserRow({ uid, email, name, role, disabled, lastLogin, isSelf }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(task: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await task();
      } catch {
        setError("L'opération a échoué.");
      }
    });
  }

  return (
    <li className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {name ?? email} {isSelf ? <span className="text-xs text-muted-foreground">(vous)</span> : null}
          {disabled ? <span className="ml-2 rounded bg-danger/10 px-1.5 py-0.5 text-xs text-danger">désactivé</span> : null}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {name ? `${email} · ` : ""}
          {lastLogin ? `dernière connexion le ${lastLogin}` : "jamais connecté"}
        </p>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
      {isSelf ? (
        <span className="text-sm text-muted-foreground">{ROLE_LABELS[role]}</span>
      ) : (
        <div className="flex items-center gap-2">
          <select
            aria-label={`Rôle de ${email}`}
            defaultValue={role}
            disabled={pending}
            onChange={(e) => run(() => changeRole(uid, e.target.value as Role))}
            className={`${selectClass} w-40`}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <Button variant={disabled ? "secondary" : "ghost"} disabled={pending} onClick={() => run(() => setUserDisabled(uid, !disabled))}>
            {disabled ? "Réactiver" : "Désactiver"}
          </Button>
        </div>
      )}
    </li>
  );
}
