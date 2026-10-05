import Image from "next/image";

/**
 * Logo officiel : version claire pour les fonds sombres, version d'origine sinon.
 * Sur fond clair, la version blanche prend le relais quand le visiteur est en mode sombre.
 */
export function Logo({ agencyName, logoUrl, dark = false, className = "h-11 w-auto" }: { agencyName: string; logoUrl?: string; dark?: boolean; className?: string }) {
  if (logoUrl) {
    // Logo personnalisé saisi dans les paramètres (adresse externe).
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={agencyName} className={className} />;
  }
  const white = (extra = "") => (
    <Image src="/brand/logo-jenga-digital-white.png" alt={agencyName} width={720} height={310} priority className={`${className} ${extra}`} />
  );
  if (dark) return white();
  return (
    <>
      <Image src="/brand/logo-jenga-digital-transparent.png" alt={agencyName} width={640} height={276} priority className={`${className} dark:hidden`} />
      {white("hidden dark:block")}
    </>
  );
}
