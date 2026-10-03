import { escapeHtml } from "./html";
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

const nl2br = (value: string) => escapeHtml(value).replace(/\n/g, "<br>");

export function contactNotificationEmail(params: {
  agencyName: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  serviceName: string;
  message: string;
  sourcePage: string;
  dashboardUrl: string | null;
}) {
  const rows: [string, string][] = [
    ["Nom", params.name],
    ["Email", params.email],
    ["Téléphone", params.phone],
    ["Entreprise", params.company],
    ["Service", params.serviceName],
    ["Page", params.sourcePage],
  ].filter(([, v]) => v) as [string, string][];
  const subject = `Nouveau message : ${params.subject || params.name}`;
  const text = [
    `Nouveau message reçu depuis le site ${params.agencyName}.`,
    ``,
    ...rows.map(([k, v]) => `${k} : ${v}`),
    params.subject ? `Objet : ${params.subject}` : "",
    ``,
    params.message,
    ``,
    `Répondez directement à cet email pour écrire à ${params.name}.`,
    params.dashboardUrl ? `Voir dans le dashboard : ${params.dashboardUrl}` : "",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
  const html = `<p>Nouveau message reçu depuis le site <strong>${escapeHtml(params.agencyName)}</strong>.</p>
<table cellpadding="4" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#64748b">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
${params.subject ? `<p><strong>${escapeHtml(params.subject)}</strong></p>` : ""}
<p style="white-space:normal">${nl2br(params.message)}</p>
<p style="color:#64748b">Répondez directement à cet email pour écrire à ${escapeHtml(params.name)}.</p>
${params.dashboardUrl ? `<p><a href="${escapeHtml(params.dashboardUrl)}">Voir dans le dashboard</a></p>` : ""}`;
  return { subject, text, html };
}

export function contactAcknowledgementEmail(params: { agencyName: string; name: string; message: string }) {
  const subject = `Nous avons bien reçu votre message – ${params.agencyName}`;
  const text = [
    `Bonjour ${params.name},`,
    ``,
    `Merci pour votre message. L'équipe ${params.agencyName} vous répond dans les plus brefs délais.`,
    ``,
    `Rappel de votre message :`,
    params.message,
  ].join("\n");
  const html = `<p>Bonjour ${escapeHtml(params.name)},</p>
<p>Merci pour votre message. L'équipe ${escapeHtml(params.agencyName)} vous répond dans les plus brefs délais.</p>
<p style="color:#64748b">Rappel de votre message :</p>
<blockquote style="border-left:3px solid #e2e8f0;margin:0;padding-left:12px">${nl2br(params.message)}</blockquote>`;
  return { subject, text, html };
}
