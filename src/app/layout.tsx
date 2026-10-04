import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

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
    <html lang="fr" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
