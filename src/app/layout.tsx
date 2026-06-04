import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { AuthProvider } from "@/components/providers/auth-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { siteConfig } from "@/config/site";
import { defaultMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
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
      lang={siteConfig.locale}
      suppressHydrationWarning
      className={cn("bg-background font-sans text-foreground", inter.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <JsonLdScript
          data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]}
        />
        <ThemeProvider>
          <StoreProvider>
            <AuthProvider>
              <SiteNavbar />
              <div className="bg-background pt-14">
                <AppShell>{children}</AppShell>
              </div>
            </AuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
