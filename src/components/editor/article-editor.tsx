"use client";

import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Maximize2Icon, Minimize2Icon, PanelTopCloseIcon, PanelTopOpenIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { EditorContextMenu } from "@/components/editor/editor-context-menu";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
import { Button } from "@/components/ui/button";
import { useUpdateAdminArticleMutation } from "@/features/admin/api/admin-api";
import {
  useCreateArticleMutation,
  useSubmitArticleMutation,
  useUpdateArticleMutation,
} from "@/features/articles/api/articles-api";
import { syncFigureLayoutInHtml } from "@/lib/articles/sync-figure-layout-html";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { extractTitleFromJson } from "@/lib/editor/extract-title";
import { fetchAiSuggestion } from "@/lib/editor/fetch-ai-suggestion";
import {
  getSubmitBlockReason,
  getSubmitReadiness,
} from "@/lib/editor/submit-requirements";
import { getWritingStats } from "@/lib/editor/writing-stats";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { articleSurfaceClassName, writeSurfaceClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

const writeButtonClass =
  "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground";

interface ArticleEditorProps {
  initialHtml?: string;
  initialJson?: Record<string, unknown>;
  articleId?: string;
  reviewNote?: string;
  mode?: "author" | "admin";
}

export function ArticleEditor({
  initialHtml = "",
  initialJson,
  articleId: initialArticleId,
  reviewNote,
  mode = "author",
}: ArticleEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { chromeHidden, setChromeHidden, toggleChromeHidden, focusMode, setFocusMode } =
    useWriteChrome();
  const isAuthorWritePage = mode === "author";
  const [articleId, setArticleId] = useState<string | undefined>(initialArticleId);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitBlockReason, setSubmitBlockReason] = useState<string | null>(
    "kamida 200 ta so'z va kamida 1 ta rasm",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);
  const articleIdRef = useRef<string | undefined>(initialArticleId);

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [submitArticle] = useSubmitArticleMutation();
  const [updateAdminArticle] = useUpdateAdminArticleMutation();
  const isAdminMode = mode === "admin";
  const { settings } = useSettings();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const aiEnabledRef = useRef(settings.aiAssistEnabled);
  const accessTokenRef = useRef(accessToken);

  const fetchSuggestion = useCallback(async (context: string) => {
    if (!aiEnabledRef.current) return "";
    return fetchAiSuggestion(context, accessTokenRef.current);
  }, []);

  useEffect(() => {
    articleIdRef.current = articleId;
  }, [articleId]);

  const updateSubmitReadiness = useCallback((ed: Editor) => {
    const readiness = getSubmitReadiness(ed);
    setCanSubmit(readiness.canSubmit);
    setSubmitBlockReason(getSubmitBlockReason(ed));
  }, []);

  const persist = useCallback(async (ed: Editor) => {
      const contentJson = ed.getJSON() as Record<string, unknown>;
      const contentHtml = syncFigureLayoutInHtml(ed.getHTML(), contentJson);
      const title = extractTitleFromJson(ed.getJSON());
      const { words } = getWritingStats(ed);
      const readiness = getSubmitReadiness(ed);

      if (words === 0 && !readiness.hasImage) {
        return;
      }

      try {
        if (isAdminMode) {
          const currentArticleId = articleIdRef.current;
          if (!currentArticleId) return;
          await updateAdminArticle({
            id: currentArticleId,
            body: { title, contentHtml, contentJson },
          }).unwrap();
          return;
        }

        const body = { title, contentHtml, contentJson, status: "draft" as const };
        const currentArticleId = articleIdRef.current;

        if (currentArticleId) {
          await updateArticle({ id: currentArticleId, body }).unwrap();
        } else {
          const result = await createArticle(body).unwrap();
          articleIdRef.current = result.article.id;
          setArticleId(result.article.id);
        }
      } catch {
        toast.error("Qoralama saqlanmadi");
      }
    },
    [createArticle, isAdminMode, updateAdminArticle, updateArticle],
  );

  const editor = useEditor({
    extensions: createEditorExtensions({
      aiAutocomplete: {
        enabled: settings.aiAssistEnabled,
        fetchSuggestion,
      },
    }),
    content: editorResetKey === 0 ? (initialJson ?? initialHtml) : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "article-editor-content min-h-[50vh] px-4 py-4 focus:outline-none sm:px-8 sm:py-5",
      },
    },
    onCreate: ({ editor: ed }) => {
      updateSubmitReadiness(ed);
    },
    onUpdate: ({ editor: ed }) => {
      updateSubmitReadiness(ed);
      if (submittedRef.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(ed);
      }, 1500);
    },
  }, [editorResetKey]);

  useEffect(() => {
    aiEnabledRef.current = settings.aiAssistEnabled;
    accessTokenRef.current = accessToken;
    if (editor) {
      const extension = editor.extensionManager.extensions.find(
        (item) => item.name === "aiAutocomplete",
      );
      if (extension) {
        extension.options.enabled = settings.aiAssistEnabled;
      }
    }
  }, [settings.aiAssistEnabled, accessToken, editor]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!focusMode) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focusMode]);

  useEffect(() => {
    if (!editor) return;
    const el = editor.view.dom;
    el.classList.toggle("min-h-[50vh]", !focusMode);
    el.classList.toggle("min-h-full", focusMode);
  }, [focusMode, editor]);

  const handleSubmit = async () => {
    if (!editor) return;

    const blockReason = getSubmitBlockReason(editor);
    if (blockReason) {
      toast.error(`Ko'rib chiqishga yuborish uchun ${blockReason} kerak`);
      return;
    }

    const contentJson = editor.getJSON() as Record<string, unknown>;
    const contentHtml = syncFigureLayoutInHtml(editor.getHTML(), contentJson);
    const title = extractTitleFromJson(editor.getJSON());
    const body = { title, contentHtml, contentJson };

    setIsSubmitting(true);
    try {
      let id = articleIdRef.current;
      if (!id) {
        const created = await createArticle({ ...body, status: "draft" }).unwrap();
        id = created.article.id;
        articleIdRef.current = id;
        setArticleId(id);
      }
      await submitArticle({ id, body }).unwrap();
      if (saveTimer.current) clearTimeout(saveTimer.current);
      submittedRef.current = true;
      setSubmitted(true);
      toast.success("Ko'rib chiqishga yuborildi");
    } catch {
      toast.error("Yuborishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewArticle = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    submittedRef.current = false;
    setSubmitted(false);
    articleIdRef.current = undefined;
    setArticleId(undefined);
    setFocusMode(false);
    setChromeHidden(false);
    setCanSubmit(false);
    setSubmitBlockReason("kamida 200 ta so'z va kamida 1 ta rasm");
    setEditorResetKey((key) => key + 1);

    if (pathname !== "/yozish") {
      router.replace("/yozish");
    }
  };

  const surfaceClassName = isAuthorWritePage
    ? writeSurfaceClassName
    : articleSurfaceClassName;

  const editorPanel = (
    <div className={cn("flex min-h-0 w-full flex-1 flex-col", surfaceClassName)}>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
        )}
      >
        <div
          className={cn(
            "sticky z-40 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 top-0",
          )}
        >
          <div className="flex flex-wrap items-center justify-end gap-2 py-2 sm:gap-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {!isAdminMode && !submitted && submitBlockReason ? (
                <p className="text-xs text-muted-foreground">
                  Ko&apos;rib chiqishga yuborish uchun {submitBlockReason} kerak
                </p>
              ) : null}
              {isAuthorWritePage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={toggleChromeHidden}
                  aria-pressed={chromeHidden}
                >
                  {chromeHidden ? (
                    <PanelTopOpenIcon className="size-4" />
                  ) : (
                    <PanelTopCloseIcon className="size-4" />
                  )}
                  Menyu
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  const next = !focusMode;
                  if (isAuthorWritePage) {
                    setChromeHidden(next);
                  }
                  setFocusMode(next);
                }}
                aria-pressed={focusMode}
              >
                {focusMode ? (
                  <Minimize2Icon className="size-4" />
                ) : (
                  <Maximize2Icon className="size-4" />
                )}
                Fokus
              </Button>
              {isAdminMode ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                >
                  Admin panelga qaytish
                </Button>
              ) : submitted ? (
                <Button
                  type="button"
                  size="sm"
                  className={writeButtonClass}
                  onClick={handleStartNewArticle}
                >
                  Yangi maqola yozish
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className={writeButtonClass}
                  disabled={isSubmitting || !canSubmit}
                  title={
                    submitBlockReason
                      ? `Ko'rib chiqishga yuborish uchun ${submitBlockReason} kerak`
                      : undefined
                  }
                  onClick={() => void handleSubmit()}
                >
                  Ko&apos;rib chiqishga yuborish
                </Button>
              )}
            </div>
          </div>

          <EditorToolbar editor={editor} />
        </div>

        {reviewNote ? (
          <div className="mx-4 mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-6">
            <span className="font-medium">Rad etish sababi: </span>
            {reviewNote}
          </div>
        ) : null}

        <div
          className={cn(
            focusMode &&
              "min-h-0 flex-1 overflow-y-auto [&_.ProseMirror]:min-h-full",
          )}
        >
          <EditorContent editor={editor} />
          <EditorContextMenu editor={editor} />
        </div>
      </div>
    </div>
  );

  if (focusMode) {
    return (
      <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-background">
        {editorPanel}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {editorPanel}
    </div>
  );
}
