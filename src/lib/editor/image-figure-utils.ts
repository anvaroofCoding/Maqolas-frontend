import type { ImageAlign } from "@/lib/editor/image-constants";

export function parseImageWidth(value: string | null | undefined): string {
  if (!value) return "50";
  const numeric = value.replace("%", "").trim();
  const parsed = Number.parseInt(numeric, 10);
  if (!Number.isFinite(parsed)) return "50";
  return String(Math.min(100, Math.max(15, parsed)));
}

export function figureAlignClass(align: ImageAlign, inRow = false): string {
  if (inRow) return "article-figure article-figure--in-row";
  return `article-figure article-figure--align-${align}`;
}

export function readAlignFromAttrs(attrs: Record<string, unknown>): ImageAlign {
  const value = attrs.align ?? attrs["data-align"];
  if (value === "left" || value === "right" || value === "center") {
    return value;
  }
  return "center";
}

export function readWidthFromAttrs(attrs: Record<string, unknown>): string {
  const width = attrs.width ?? attrs["data-width"];
  if (typeof width === "string" || typeof width === "number") {
    return parseImageWidth(String(width));
  }
  return "50";
}

export function readAlignFromElement(element: Element): ImageAlign {
  const dataAlign = element.getAttribute("data-align");
  if (dataAlign === "left" || dataAlign === "right" || dataAlign === "center") {
    return dataAlign;
  }

  const className = element.className;
  if (className.includes("--align-left") || className.includes("--left")) {
    return "left";
  }
  if (className.includes("--align-right") || className.includes("--right")) {
    return "right";
  }
  return "center";
}

export function readWidthFromElement(element: Element): string {
  const dataWidth = element.getAttribute("data-width");
  if (dataWidth) return parseImageWidth(dataWidth);

  const styleWidth = (element as HTMLElement).style.width;
  if (styleWidth?.endsWith("%")) {
    return parseImageWidth(styleWidth);
  }

  return "50";
}

export function figureWidthStyle(width: string, align: ImageAlign, inRow: boolean) {
  if (inRow) return { width: "100%" } as const;
  const parsed = parseImageWidth(width);
  if (align === "center") {
    return { width: `${parsed}%`, maxWidth: "100%" } as const;
  }
  return { width: `${parsed}%`, maxWidth: "min(100%, 520px)" } as const;
}
