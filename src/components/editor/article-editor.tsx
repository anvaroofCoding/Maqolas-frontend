"use client";

import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { Button } from "@/components/ui/button";
import { useUpdateAdminArticleMutation } from "@/features/admin/api/admin-api";
import {
  useCreateArticleMutation,
  useSubmitArticleMutation,
  useUpdateArticleMutation,
} from "@/features/articles/api/articles-api";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { extractTitleFromJson } from "@/lib/editor/extract-title";
import { fetchAiSuggestion } from "@/lib/editor/fetch-ai-suggestion";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { articleSurfaceClassName } from "@/lib/layout";
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
  const [focusMode, setFocusMode] = useState(false);
  const [articleId, setArticleId] = useState<string | undefined>(initialArticleId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);

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

  const persist = useCallback(async (ed: Editor) => {
      const contentHtml = ed.getHTML();
      const contentJson = ed.getJSON() as Record<string, unknown>;
      const title = extractTitleFromJson(ed.getJSON());

      try {
        if (isAdminMode) {
          if (!articleId) return;
          await updateAdminArticle({
            id: articleId,
            body: { title, contentHtml, contentJson },
          }).unwrap();
          return;
        }

        const body = { title, contentHtml, contentJson, status: "draft" as const };

        if (articleId) {
          await updateArticle({ id: articleId, body }).unwrap();
        } else {
          const result = await createArticle(body).unwrap();
          setArticleId(result.article.id);
        }
      } catch {
        toast.error("Qoralama saqlanmadi");
      }
    },
    [articleId, createArticle, isAdminMode, updateAdminArticle, updateArticle],
  );

  const editor = useEditor({
    extensions: createEditorExtensions({
      aiAutocomplete: {
        enabled: settings.aiAssistEnabled,
        fetchSuggestion,
      },
    }),
    content: initialJson ?? initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "article-editor-content min-h-[55vh] px-6 py-8 focus:outline-none sm:px-10",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (submittedRef.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(ed);
      }, 1500);
    },
  });

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
    el.classList.toggle("min-h-[55vh]", !focusMode);
    el.classList.toggle("min-h-full", focusMode);
  }, [focusMode, editor]);

  const handleSubmit = async () => {
    if (!editor) return;
    const contentHtml = editor.getHTML();
    const contentJson = editor.getJSON() as Record<string, unknown>;
    const title = extractTitleFromJson(editor.getJSON());
    const body = { title, contentHtml, contentJson };

    setIsSubmitting(true);
    try {
      let id = articleId;
      if (!id) {
        const created = await createArticle({ ...body, status: "draft" }).unwrap();
        id = created.article.id;
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
    setArticleId(undefined);
    setFocusMode(false);
    editor?.commands.clearContent();

    if (pathname !== "/yozish") {
      router.replace("/yozish");
    }
  };

  return (
    <div
      className={cn(
        focusMode &&
          "fixed inset-0 z-[100] flex h-dvh w-full flex-col bg-background",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-1 flex-col",
          focusMode
            ? "h-full min-h-0 max-w-none px-4 py-3"
            : articleSurfaceClassName,
        )}
      >
        <div
          className={cn(
            "flex flex-col",
            focusMode && "min-h-0 flex-1 overflow-hidden",
          )}
        >
          <div
            className={cn(
              "sticky z-40 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6",
              focusMode ? "top-0" : "top-14",
            )}
          >
            <div className="flex flex-wrap items-center justify-end gap-3 py-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setFocusMode((v) => !v)}
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
                    disabled={isSubmitting}
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
              focusMode && "min-h-0 flex-1 overflow-y-auto [&_.ProseMirror]:min-h-full",
            )}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
