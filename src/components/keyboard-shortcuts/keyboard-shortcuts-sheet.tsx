"use client";

import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/components/keyboard-shortcuts/keyboard-shortcuts-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  bindingFromKeyboardEvent,
  formatShortcut,
} from "@/lib/keyboard-shortcuts/format";
import type { ShortcutActionId } from "@/lib/keyboard-shortcuts/types";
import { cn } from "@/lib/utils";

function RecordingButtonLabel() {
  return (
    <span className="inline-flex items-baseline">
      Bosing
      <span className="inline-flex w-[1.05em]" aria-hidden>
        <span className="shortcut-recording-dot">.</span>
        <span className="shortcut-recording-dot">.</span>
        <span className="shortcut-recording-dot">.</span>
      </span>
    </span>
  );
}

function ShortcutCaptureButton({
  actionId,
  bindingLabel,
  isRecording,
  onStart,
  onCapture,
}: {
  actionId: ShortcutActionId;
  bindingLabel: string;
  isRecording: boolean;
  onStart: () => void;
  onCapture: (binding: ReturnType<typeof bindingFromKeyboardEvent>) => void;
}) {
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        onCapture(null);
        return;
      }

      const binding = bindingFromKeyboardEvent(event);
      if (!binding) return;
      onCapture(binding);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isRecording, onCapture]);

  return (
    <Button
      type="button"
      variant={isRecording ? "default" : "outline"}
      size="sm"
      className="h-8 min-w-[7.5rem] rounded-lg px-3 font-mono text-xs"
      onClick={onStart}
    >
      {isRecording ? <RecordingButtonLabel /> : bindingLabel}
    </Button>
  );
}

export function KeyboardShortcutsSheet() {
  const {
    shortcuts,
    sheetOpen,
    closeSheet,
    setShortcut,
    resetShortcut,
    resetAllShortcuts,
    overrides,
  } = useKeyboardShortcuts();
  const [recordingId, setRecordingId] = useState<ShortcutActionId | null>(null);

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle>Klaviatura tugmalari</SheetTitle>
          <SheetDescription>
            Funksiyalarni tez bajarish uchun tugma kombinatsiyalari. O&apos;zingiz
            uchun tahrirlashingiz mumkin.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="relative ml-2 space-y-0">
            {shortcuts.map((shortcut, index) => {
              const isCustom = Boolean(overrides[shortcut.id]);
              const isRecording = recordingId === shortcut.id;

              return (
                <div
                  key={shortcut.id}
                  className="relative grid grid-cols-[auto_1fr] gap-x-4 pb-6 last:pb-0"
                >
                  <div className="relative flex w-4 justify-center">
                    <span
                      className={cn(
                        "relative z-10 mt-1.5 size-2.5 rounded-full ring-4 ring-background",
                        isCustom ? "bg-amber-500" : "bg-primary",
                      )}
                      aria-hidden
                    />
                    {index < shortcuts.length - 1 ? (
                      <span
                        className="absolute top-3 bottom-[-1.35rem] w-px bg-border"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 space-y-2 rounded-xl border bg-card p-3 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {shortcut.label}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {shortcut.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <ShortcutCaptureButton
                        actionId={shortcut.id}
                        bindingLabel={formatShortcut(shortcut.binding)}
                        isRecording={isRecording}
                        onStart={() => setRecordingId(shortcut.id)}
                        onCapture={(binding) => {
                          setRecordingId(null);
                          if (!binding) return;
                          setShortcut(shortcut.id, binding);
                        }}
                      />

                      {isCustom ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-muted-foreground"
                          onClick={() => resetShortcut(shortcut.id)}
                        >
                          Tiklash
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t px-5 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={resetAllShortcuts}
          >
            <RotateCcwIcon className="size-4" aria-hidden />
            Barchasini standartga qaytarish
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
