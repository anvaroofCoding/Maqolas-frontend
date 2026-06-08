"use client";

import { Download, Instagram, Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { iosIconClass } from "@/components/articles/flying-like-heart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleStoryData } from "@/lib/articles/export-article-story-image";
import {
  DEFAULT_STORY_TEMPLATE,
  downloadArticleStoryImage,
  generateArticleStoryImage,
  shareArticleStoryImage,
  STORY_TEMPLATES,
  type StorySharePlatform,
  type StoryTemplateId,
} from "@/lib/articles/export-article-story-image";
import { renderStoryTemplateThumbnail } from "@/lib/articles/story-background-templates";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M9.78 15.53 9.6 19.8c.31 0 .45-.13.61-.29l1.47-1.4 3.05 2.24c.56.31.96.15 1.1-.52l2.01-9.44h.01c.18-.84-.3-1.17-.85-.97L3.9 10.77c-.82.32-.81.78-.14.99l4.46 1.39 10.36-6.54c.49-.32.93-.14.57.18" />
    </svg>
  );
}

type ArticleShareStoryProps = {
  storyData: ArticleStoryData;
  variant?: "overlay" | "inline" | "engagement";
  className?: string;
};

export function ArticleShareStory({
  storyData,
  variant = "overlay",
  className,
}: ArticleShareStoryProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState<StorySharePlatform | "save" | null>(
    null,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<StoryTemplateId>(DEFAULT_STORY_TEMPLATE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [templateThumbs, setTemplateThumbs] = useState<
    Partial<Record<StoryTemplateId, string>>
  >({});
  const blobRef = useRef<Blob | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const templateButtonRefs = useRef<Partial<Record<StoryTemplateId, HTMLButtonElement>>>({});

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    blobRef.current = null;
  }, []);

  const generatePreview = useCallback(
    async (templateId: StoryTemplateId) => {
      setGenerating(true);
      clearPreview();

      try {
        const blob = await generateArticleStoryImage(storyData, templateId);
        if (!blob) {
          toast.error("Story rasmi yaratilmadi. Qayta urinib ko'ring.");
          return;
        }

        blobRef.current = blob;
        const nextUrl = URL.createObjectURL(blob);
        previewUrlRef.current = nextUrl;
        setPreviewUrl(nextUrl);
      } catch {
        toast.error("Story rasmi yaratilmadi. Qayta urinib ko'ring.");
      } finally {
        setGenerating(false);
      }
    },
    [clearPreview, storyData],
  );

  const handleOpen = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setSelectedTemplate(DEFAULT_STORY_TEMPLATE);
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      clearPreview();
      setSharing(null);
      setSelectedTemplate(DEFAULT_STORY_TEMPLATE);
    }
  };

  const handleTemplateSelect = (templateId: StoryTemplateId) => {
    if (templateId === selectedTemplate || generating) return;
    setSelectedTemplate(templateId);
  };

  useEffect(() => {
    const thumbs = Object.fromEntries(
      STORY_TEMPLATES.map((template) => [
        template.id,
        renderStoryTemplateThumbnail(template.id),
      ]),
    ) as Record<StoryTemplateId, string>;
    setTemplateThumbs(thumbs);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    void generatePreview(selectedTemplate);
  }, [open, selectedTemplate, generatePreview]);

  useEffect(() => {
    if (!open) return;
    const button = templateButtonRefs.current[selectedTemplate];
    button?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [open, selectedTemplate]);

  const handleShare = async (platform: StorySharePlatform) => {
    if (!blobRef.current) return;

    setSharing(platform);
    try {
      const result = await shareArticleStoryImage(
        blobRef.current,
        storyData.slug,
        platform,
      );

      if (result === "shared") {
        toast.success(
          platform === "instagram"
            ? "Instagram orqali ulashish ochildi"
            : "Telegram orqali ulashish ochildi",
        );
        setOpen(false);
        return;
      }

      toast.info(
        platform === "instagram"
          ? "Rasm yuklab olindi. Instagram Stories'ga qo'shing."
          : "Rasm yuklab olindi. Telegram Stories'ga qo'shing.",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("Ulashish amalga oshmadi. Qayta urinib ko'ring.");
    } finally {
      setSharing(null);
    }
  };

  const handleSave = async () => {
    if (!blobRef.current) return;

    setSharing("save");
    try {
      await downloadArticleStoryImage(blobRef.current, storyData.slug);
      toast.success("Story rasmi saqlandi");
    } catch {
      toast.error("Rasmni saqlab bo'lmadi");
    } finally {
      setSharing(null);
    }
  };

  const trigger =
    variant === "engagement" ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 gap-2 rounded-full border-0 bg-transparent px-3 font-normal text-muted-foreground shadow-none",
          "hover:bg-transparent hover:text-foreground",
          className,
        )}
        aria-label="Story'ga ulashish"
        onClick={(event) => void handleOpen(event)}
      >
        <Share2 className={iosIconClass} aria-hidden />
      </Button>
    ) : (
      <button
        type="button"
        className={cn(
          variant === "overlay"
            ? cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "bg-black/45 text-white backdrop-blur-sm",
                "transition-colors duration-200 hover:bg-black/60",
              )
            : cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-3",
                "text-sm text-muted-foreground hover:text-foreground",
              ),
          className,
        )}
        aria-label="Story'ga ulashish"
        onClick={(event) => void handleOpen(event)}
      >
        <Share2 className="size-4" aria-hidden />
        {variant === "inline" ? (
          <span className="text-sm">Ulashish</span>
        ) : null}
      </button>
    );

  return (
    <>
      {trigger}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[92dvh] max-w-md flex-col gap-0 overflow-hidden p-0 max-sm:fixed max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:max-h-[94dvh] max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-1 border-b px-4 py-3 text-left sm:px-5 sm:py-4">
            <DialogTitle>Story&apos;ga ulashish</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Maqola reklama rasmini Instagram yoki Telegram story&apos;siga
              yuboring yoki saqlab oling.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/40 sm:flex-row sm:items-start sm:overflow-visible sm:p-5 sm:gap-4">
            <div className="order-2 flex shrink-0 justify-center px-4 py-3 sm:order-1 sm:p-0">
              <div className="relative aspect-[9/16] w-[130px] shrink-0 overflow-hidden rounded-2xl border bg-background shadow-lg sm:w-[220px]">
                {generating ? (
                  <Skeleton className="absolute inset-0 rounded-none" />
                ) : previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Story ko'rinishi"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                    Ko&apos;rinish yaratilmadi
                  </div>
                )}

                {generating ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <Loader2 className="size-6 animate-spin text-nav-active sm:size-8" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-3 sm:order-2 sm:max-h-[391px] sm:p-0 sm:pt-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Fon shabloni
                </p>
                <p className="text-[11px] text-muted-foreground sm:hidden">
                  Chapga suring
                </p>
              </div>
              <div
                className={cn(
                  "scrollbar-hidden flex gap-2 overflow-x-auto px-1 pb-3",
                  "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
                  "sm:max-h-none sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:px-0 sm:pb-1 sm:snap-none",
                )}
              >
                {STORY_TEMPLATES.map((template) => {
                  const isActive = selectedTemplate === template.id;
                  const thumb = templateThumbs[template.id];

                  return (
                    <button
                      key={template.id}
                      ref={(node) => {
                        if (node) templateButtonRefs.current[template.id] = node;
                      }}
                      type="button"
                      aria-label={`${template.label} shabloni`}
                      aria-pressed={isActive}
                      disabled={generating}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={cn(
                        "flex shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl p-2 transition-all",
                        "w-[72px] sm:w-full sm:flex-row sm:items-center sm:gap-3 sm:p-2 sm:text-left",
                        isActive
                          ? "bg-nav-active/15 ring-2 ring-nav-active"
                          : "bg-background/80 ring-1 ring-border hover:ring-nav-active/40",
                      )}
                    >
                      <div className="relative h-[88px] w-[52px] shrink-0 overflow-hidden rounded-lg sm:h-14 sm:w-8 sm:rounded-md">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <Skeleton className="absolute inset-0 rounded-none" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "w-full truncate text-center text-[11px] leading-tight sm:text-left sm:text-sm",
                          isActive
                            ? "font-semibold text-nav-active"
                            : "text-foreground",
                        )}
                      >
                        {template.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-2 border-t p-3 sm:grid-cols-3 sm:p-5">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-col gap-1 rounded-xl px-1 text-[11px] sm:h-11 sm:flex-row sm:justify-start sm:gap-2 sm:px-4 sm:text-sm"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleShare("instagram")}
            >
              {sharing === "instagram" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Instagram className="size-4" />
              )}
              <span className="truncate">Instagram</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-10 flex-col gap-1 rounded-xl px-1 text-[11px] sm:h-11 sm:flex-row sm:justify-start sm:gap-2 sm:px-4 sm:text-sm"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleShare("telegram")}
            >
              {sharing === "telegram" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <TelegramIcon className="size-4" />
              )}
              <span className="truncate">Telegram</span>
            </Button>

            <Button
              type="button"
              className="h-10 flex-col gap-1 rounded-xl px-1 text-[11px] sm:h-11 sm:flex-row sm:justify-start sm:gap-2 sm:px-4 sm:text-sm"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleSave()}
            >
              {sharing === "save" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              <span className="truncate">Saqlash</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
