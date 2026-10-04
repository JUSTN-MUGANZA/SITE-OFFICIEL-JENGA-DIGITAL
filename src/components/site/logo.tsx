import Image from "next/image";

/** Logo officiel : version claire pour les fonds sombres, version d'origine sinon. */
export function Logo({ agencyName, logoUrl, dark = false, className = "h-11 w-auto" }: { agencyName: string; logoUrl?: string; dark?: boolean; className?: string }) {
  if (logoUrl) {
    // Logo personnalisé saisi dans les paramètres (adresse externe).
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={agencyName} className={className} />;
  }
  return dark ? (
    <Image src="/brand/logo-jenga-digital-white.png" alt={agencyName} width={720} height={310} priority className={className} />
  ) : (
    <Image src="/brand/logo-jenga-digital-transparent.png" alt={agencyName} width={640} height={276} priority className={className} />
  );
}
