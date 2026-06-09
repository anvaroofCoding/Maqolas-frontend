"use client";

import {
  BellIcon,
  PaletteIcon,
  RotateCcwIcon,
  SparklesIcon,
  Volume2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/components/providers/settings-provider";
import { THEME_PRESETS } from "@/lib/settings/theme-presets";
import {
  NOTIFICATION_SOUNDS,
  playNotificationSound,
} from "@/lib/settings/notification-sounds";
import type { ThemePresetId } from "@/lib/settings/types";
import { cn } from "@/lib/utils";

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, settings, updateSettings, resetSettings } =
    useSettings();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="max-h-[min(90vh,44rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sozlamalar</DialogTitle>
          <DialogDescription>
            Sayt ko&apos;rinishi, bildirishnoma ovozlari va yozish yordamchisini
            sozlang.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="gap-5">
          <TabsList className="w-full">
            <TabsTrigger value="appearance" className="gap-1.5">
              <PaletteIcon className="size-3.5" />
              Ko&apos;rinish
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5">
              <BellIcon className="size-3.5" />
              Ovozlar
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-1.5">
              <SparklesIcon className="size-3.5" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-5">
            <section className="space-y-3">
              <div>
                <p className="text-sm font-medium">Mavzu rejimi</p>
                <p className="text-xs text-muted-foreground">
                  Yorug&apos; yoki qorong&apos;i rejimni tanlang.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "light", label: "Yorug'" },
                    { id: "dark", label: "Qorong'i" },
                    { id: "system", label: "Tizim" },
                  ] as const
                ).map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={theme === option.id ? "default" : "outline"}
                    className={cn(
                      theme === option.id &&
                        "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover",
                    )}
                    onClick={() => setTheme(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <p className="text-sm font-medium">Rang shablonlari</p>
                <p className="text-xs text-muted-foreground">
                  Tugmalar, havolalar va faol elementlar rangi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {THEME_PRESETS.map((preset) => {
                  const isActive = settings.themePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        updateSettings({ themePresetId: preset.id })
                      }
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                        isActive
                          ? "border-nav-active bg-nav-active/10 ring-2 ring-nav-active/30"
                          : "border-border hover:bg-muted/60",
                      )}
                    >
                      <span
                        className="size-5 shrink-0 rounded-full ring-1 ring-border"
                        style={{ backgroundColor: preset.swatch }}
                        aria-hidden
                      />
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-dashed p-4">
              <div>
                <p className="text-sm font-medium">O&apos;z rangingiz</p>
                <p className="text-xs text-muted-foreground">
                  Istagan rangni tanlab, shablon sifatida qo&apos;ying.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  value={settings.customAccentColor}
                  onChange={(event) =>
                    updateSettings({
                      customAccentColor: event.target.value,
                      themePresetId: "custom",
                    })
                  }
                  className="size-10 cursor-pointer rounded-lg border border-border bg-transparent p-1"
                  aria-label="Maxsus rang"
                />
                <div className="flex flex-1 flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      settings.themePresetId === "custom" ? "default" : "outline"
                    }
                    className={cn(
                      settings.themePresetId === "custom" &&
                        "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover",
                    )}
                    onClick={() =>
                      updateSettings({ themePresetId: "custom" as ThemePresetId })
                    }
                  >
                    Rangni qo&apos;llash
                  </Button>
                  <span className="self-center font-mono text-xs text-muted-foreground">
                    {settings.customAccentColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div>
              <p className="text-sm font-medium">Bildirishnoma ovozi</p>
              <p className="text-xs text-muted-foreground">
                Yangi bildirishnoma kelganda tanlangan ovoz chalinadi.
              </p>
            </div>
            <div className="grid gap-2">
              {NOTIFICATION_SOUNDS.map((sound) => {
                const isActive = settings.notificationSoundId === sound.id;
                return (
                  <div
                    key={sound.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                      isActive
                        ? "border-nav-active bg-nav-active/10"
                        : "border-border",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({ notificationSoundId: sound.id })
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="text-sm font-medium">{sound.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sound.description}
                      </p>
                    </button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      aria-label={`${sound.name} ovozini eshitish`}
                      onClick={() => playNotificationSound(sound.id)}
                    >
                      <Volume2Icon className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="ai-assist" className="text-sm font-medium">
                    AI yozish yordamchisi
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Maqola yozayotganda AI matn takliflarini ko&apos;rsatadi.
                    Taklifni qabul qilish uchun{" "}
                    <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Tab
                    </kbd>{" "}
                    tugmasini bosing.
                  </p>
                </div>
                <button
                  id="ai-assist"
                  type="button"
                  role="switch"
                  aria-checked={settings.aiAssistEnabled}
                  onClick={() =>
                    updateSettings({ aiAssistEnabled: !settings.aiAssistEnabled })
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    settings.aiAssistEnabled ? "bg-nav-active" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform",
                      settings.aiAssistEnabled
                        ? "translate-x-5"
                        : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              AI yordamchisi yozish jarayonida kontekstga mos so&apos;zlar va
              jumlalarni taklif qiladi. Taklif yoqimsiz bo&apos;lsa, davom etib
              yozing — u avtomatik yangilanadi.
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={resetSettings}
          >
            <RotateCcwIcon className="size-3.5" />
            Standart sozlamalar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
