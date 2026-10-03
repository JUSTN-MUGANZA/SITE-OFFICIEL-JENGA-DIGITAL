import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description =
    settings.tagline || "Agence digitale : création de sites web, applications, e-commerce, référencement et marketing digital.";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${settings.agencyName} | Agence digitale`, template: `%s | ${settings.agencyName}` },
    description,
    openGraph: { type: "website", locale: "fr_FR", siteName: settings.agencyName, description },
    twitter: { card: "summary_large_image" },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
