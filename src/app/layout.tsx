import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { AccentThemeScript } from "@/components/settings/accent-theme-script";
import { ThemeInitScript } from "@/components/settings/theme-init-script";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { siteConfig } from "@/config/site";
import { defaultMetadata } from "@/lib/seo/metadata";
import {
  buildCreatorJsonLd,
  buildSiteIdentityJsonLd,
  buildSiteNavigationJsonLd,
  buildSoftwareApplicationJsonLd,
} from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.htmlLang}
      suppressHydrationWarning
      className={cn("bg-background font-sans text-foreground", poppins.variable)}
    >
      <head>
        <ThemeInitScript />
        <AccentThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <JsonLdScript
          data={[
            buildSiteIdentityJsonLd(),
            buildSiteNavigationJsonLd(),
            buildCreatorJsonLd(),
            buildSoftwareApplicationJsonLd(),
          ]}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
