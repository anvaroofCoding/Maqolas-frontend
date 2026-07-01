"use client";

import { BookmarkIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { SaveSuccessTick } from "@/components/saved-phrases/save-success-tick";
import { useSaveSelectedPhrase } from "@/components/saved-phrases/use-save-selected-phrase";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const MIN_SELECTION_LENGTH = 2;

type ArticlePhraseSaverProps = {
  articleId: string;
  containerRef: React.RefObject<HTMLElement | null>;
};

type FloatingPosition = {
  top: number;
  left: number;
};

function readSelectionInContainer(container: HTMLElement): {
  text: string;
  rect: DOMRect;
} | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();

  if (text.length < MIN_SELECTION_LENGTH) {
    return null;
  }

  if (!container.contains(range.commonAncestorContainer)) {
    return null;
  }

  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) {
    return null;
  }

  return { text, rect };
}

export function ArticlePhraseSaver({
  articleId,
  containerRef,
}: ArticlePhraseSaverProps) {
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const savingRef = useRef(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = Boolean(accessToken) || isAuthenticated;

  const { savePhrase, isSaving, showTick, dismissTick } = useSaveSelectedPhrase();

  const updateSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const result = readSelectionInContainer(container);
    if (!result) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    setSelectedText(result.text);
    setPosition({
      top: Math.max(12, result.rect.top - 44),
      left: Math.min(
        Math.max(12, result.rect.left + result.rect.width / 2),
        window.innerWidth - 12,
      ),
    });
  }, [containerRef]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handlePointerUp = () => {
      window.requestAnimationFrame(updateSelection);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.key === "Shift" ||
        event.key.startsWith("Arrow") ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        window.requestAnimationFrame(updateSelection);
      }
    };

    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchend", handlePointerUp);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [updateSelection]);

  const handleSave = async () => {
    if (!selectedText || savingRef.current) return;

    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    savingRef.current = true;

    try {
      const saved = await savePhrase(articleId, selectedText);
      if (saved) {
        setPosition(null);
        setSelectedText("");
      }
    } finally {
      savingRef.current = false;
    }
  };

  if (!mounted || !position || !selectedText) {
    return (
      <>
        <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
        {showTick ? <SaveSuccessTick onComplete={dismissTick} /> : null}
      </>
    );
  }

  return (
    <>
      {createPortal(
        <div
          className="pointer-events-none fixed z-[120]"
          style={{
            top: position.top,
            left: position.left,
            transform: "translateX(-50%)",
          }}
        >
          <Button
            type="button"
            size="sm"
            className={cn(
              "pointer-events-auto h-8 gap-1.5 rounded-full px-3 text-xs font-semibold shadow-lg",
              "animate-in fade-in zoom-in-95 duration-200",
            )}
            disabled={isSaving}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => void handleSave()}
          >
            <BookmarkIcon className="size-3.5" aria-hidden />
            Saqlash
          </Button>
        </div>,
        document.body,
      )}

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      {showTick ? <SaveSuccessTick onComplete={dismissTick} /> : null}
    </>
  );
}
