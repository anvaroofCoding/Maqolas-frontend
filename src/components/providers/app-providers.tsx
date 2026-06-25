"use client";

import { AppShell } from "@/components/layout/app-shell";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { NotificationSoundListener } from "@/components/notifications/notification-sound-listener";
import { AiArticleAssistant } from "@/components/ai-article/ai-article-assistant";
import { SettingsModal } from "@/components/settings/settings-modal";
import { WelcomePromoModal } from "@/components/welcome-promo/welcome-promo-modal";
import { AuthProvider } from "@/components/providers/auth-provider";
import { RealtimeListener } from "@/components/providers/realtime-listener";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { WriteChromeProvider } from "@/components/editor/write-chrome-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WriteChromeProvider>
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
                <div className="bg-background">
                  <AppShell>{children}</AppShell>
                </div>
              </AuthProvider>
            </ToastProvider>
          </StoreProvider>
        </SettingsProvider>
      </WriteChromeProvider>
    </ThemeProvider>
  );
}
