import { SocialIcon } from "./social-icons";

/** Ajoute un premier message à un lien wa.me, pour que le visiteur n'ait plus qu'à appuyer sur « Envoyer ». */
export function whatsappHref(link: string) {
  if (!/^https:\/\/wa\.me\//.test(link) || link.includes("?")) return link;
  return `${link}?text=${encodeURIComponent("Bonjour JENGA Digital, j'aimerais parler de mon projet.")}`;
}

/** Bouton flottant, visible sur toutes les pages publiques : écrire directement sur WhatsApp. */
export function WhatsAppButton({ link }: { link: string }) {
  if (!link) return null;
  return (
    <a
      href={whatsappHref(link)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrivez-nous directement sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25d366] p-3.5 text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.6)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5a] sm:px-5 sm:py-3.5"
    >
      <SocialIcon network="whatsapp" className="size-6" />
      <span className="hidden text-sm font-semibold sm:inline">Écrivez-nous directement sur WhatsApp</span>
    </a>
  );
}
