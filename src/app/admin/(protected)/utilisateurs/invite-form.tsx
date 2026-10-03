"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, selectClass } from "@/components/ui/field";
import { ROLE_LABELS, ROLES } from "@/lib/auth/roles";
import { inviteUser, type InviteState } from "./actions";

export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(inviteUser, { status: "idle" });
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
        <Field label="Email" name="email" type="email" required />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Rôle</span>
          <select name="role" defaultValue="editor" className={selectClass}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Envoi…" : "Inviter"}
        </Button>
      </div>
      {state.status === "error" ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" ? (
        <Alert tone="success">
          {state.message}
          {state.manualLink ? <span className="mt-2 block break-all font-mono text-xs">{state.manualLink}</span> : null}
        </Alert>
      ) : null}
    </form>
  );
}
