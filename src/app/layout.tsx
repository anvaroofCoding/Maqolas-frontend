import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { AuthProvider } from "@/components/providers/auth-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { NotificationSoundListener } from "@/components/notifications/notification-sound-listener";
import { RealtimeListener } from "@/components/providers/realtime-listener";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { AccentThemeScript } from "@/components/settings/accent-theme-script";
import { SettingsModal } from "@/components/settings/settings-modal";
import { AiArticleAssistant } from "@/components/ai-article/ai-article-assistant";
import { WelcomePromoModal } from "@/components/welcome-promo/welcome-promo-modal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { siteConfig } from "@/config/site";
import { defaultMetadata } from "@/lib/seo/metadata";
import {
  buildCreatorJsonLd,
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
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
        <AccentThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <JsonLdScript
          data={[
            buildOrganizationJsonLd(),
            buildWebSiteJsonLd(),
            buildCreatorJsonLd(),
            buildSoftwareApplicationJsonLd(),
          ]}
        />
        <ThemeProvider>
          <SettingsProvider>
            <StoreProvider>
              <ToastProvider>
                <AuthProvider>
                  <RealtimeListener />
                  <NotificationSoundListener />
                  <SettingsModal />
                  <WelcomePromoModal />
                  <AiArticleAssistant />
                  <SiteNavbar />
                  <div className="bg-background pt-14">
                    <AppShell>{children}</AppShell>
                  </div>
                </AuthProvider>
              </ToastProvider>
            </StoreProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
