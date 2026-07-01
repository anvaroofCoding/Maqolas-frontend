const SPOTLIGHT_PADDING = 8;

export type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  const style = window.getComputedStyle(element);
  return style.visibility !== "hidden" && style.display !== "none";
}

export function findTourTarget(targetId: string): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-tour="${targetId}"]`,
  );

  for (const node of nodes) {
    if (isElementVisible(node)) {
      return node;
    }
  }

  return nodes[0] ?? null;
}

export function getTourTargetRect(element: HTMLElement): SpotlightRect {
  const rect = element.getBoundingClientRect();

  return {
    top: Math.max(0, rect.top - SPOTLIGHT_PADDING),
    left: Math.max(0, rect.left - SPOTLIGHT_PADDING),
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

export function scrollTourTargetIntoView(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}
