import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
/** Polices inspirées de scalyx.fr : titres larges et géométriques, petites étiquettes en chasse fixe. */
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: ["500", "600", "700"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["500", "600"] });

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
    <html lang="fr" className={`${inter.variable} ${unbounded.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
