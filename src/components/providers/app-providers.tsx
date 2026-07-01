"use client";

import { AppShell } from "@/components/layout/app-shell";
import { SiteMobileDock } from "@/components/layout/site-mobile-dock";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { NotificationSoundListener } from "@/components/notifications/notification-sound-listener";
import { AiArticleAssistant } from "@/components/ai-article/ai-article-assistant";
import { ClickSparkles } from "@/components/effects/click-sparkles";
import { SettingsModal } from "@/components/settings/settings-modal";
import { ArticleSearchHost } from "@/components/layout/article-search-host";
import { MobileNotificationHost } from "@/components/notifications/mobile-notification-host";
import { PromoReaderHost } from "@/components/promo-reader/promo-reader-host";
import { SiteFocusModeProvider } from "@/components/layout/site-focus-mode-provider";
import { BrowserSelectionGuard } from "@/components/providers/browser-selection-guard";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts/keyboard-shortcuts-provider";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { WelcomePromoModal } from "@/components/welcome-promo/welcome-promo-modal";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NavigationPrefetcher } from "@/components/layout/navigation-prefetcher";
import { SiteContextMenu } from "@/components/layout/site-context-menu";
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
                <SiteFocusModeProvider>
                <KeyboardShortcutsProvider>
                  <BrowserSelectionGuard />
                  <NavigationPrefetcher />
                  <SiteContextMenu />
                  <RealtimeListener />
                  <NotificationSoundListener />
                  <SettingsModal />
                  <ClickSparkles />
                  <ArticleSearchHost />
                  <PromoReaderHost />
                  <MobileNotificationHost />
                  <WelcomePromoModal />
                  <OnboardingTour />
                  <AiArticleAssistant />
                  <SiteNavbar />
                  <SiteMobileDock />
                  <div className="bg-background">
                    <AppShell>{children}</AppShell>
                  </div>
                </KeyboardShortcutsProvider>
                </SiteFocusModeProvider>
              </AuthProvider>
            </ToastProvider>
          </StoreProvider>
        </SettingsProvider>
      </WriteChromeProvider>
    </ThemeProvider>
  );
}
