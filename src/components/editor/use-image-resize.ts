"use client";

import { useCallback, useRef } from "react";
import { parseImageWidth } from "@/lib/editor/image-figure-utils";

type UseImageResizeOptions = {
  onWidthChange: (width: string) => void;
};

export function useImageResize({ onWidthChange }: UseImageResizeOptions) {
  const figureRef = useRef<HTMLElement | null>(null);
  const resizingRef = useRef(false);

  const setFigureRef = useCallback((element: HTMLElement | null) => {
    figureRef.current = element;
  }, []);

  const onResizeStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const figure = figureRef.current;
      if (!figure) return;

      const contentRoot =
        figure.closest(".article-editor-content") ??
        figure.closest(".ProseMirror") ??
        figure.parentElement;
      const contentWidth = contentRoot?.clientWidth ?? 800;
      const startY = event.clientY;
      const startWidthPx = figure.getBoundingClientRect().width;
      resizingRef.current = true;
      figure.classList.add("is-resizing");

      const handleMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const deltaY = moveEvent.clientY - startY;
        const nextWidthPx = Math.max(96, startWidthPx + deltaY);
        const nextPercent = Math.round((nextWidthPx / contentWidth) * 100);
        onWidthChange(parseImageWidth(String(nextPercent)));
      };

      const handleUp = () => {
        resizingRef.current = false;
        figure.classList.remove("is-resizing");
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [onWidthChange],
  );

  return { setFigureRef, onResizeStart, isResizing: resizingRef.current };
}
