import { escapeHtml } from "./send";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";

export function invitationEmail(params: { agencyName: string; role: Role; link: string; invitedBy: string }) {
  const { agencyName, role, link, invitedBy } = params;
  const subject = `Invitation à l'administration du site ${agencyName}`;
  const text = [
    `Bonjour,`,
    ``,
    `${invitedBy} vous invite à gérer le site ${agencyName} avec le rôle « ${ROLE_LABELS[role]} ».`,
    `Choisissez votre mot de passe ici : ${link}`,
    ``,
    `Vous pourrez ensuite vous connecter avec ce mot de passe ou avec Google (même adresse email).`,
  ].join("\n");
  const html = `<p>Bonjour,</p>
<p>${escapeHtml(invitedBy)} vous invite à gérer le site <strong>${escapeHtml(agencyName)}</strong> avec le rôle « ${escapeHtml(ROLE_LABELS[role])} ».</p>
<p><a href="${escapeHtml(link)}">Choisir mon mot de passe</a></p>
<p>Vous pourrez ensuite vous connecter avec ce mot de passe ou avec Google (même adresse email).</p>`;
  return { subject, text, html };
}
