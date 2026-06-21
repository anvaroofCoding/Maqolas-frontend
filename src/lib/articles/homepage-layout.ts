import type { HomepageLayout } from "@/features/articles/types";

export function isHomepageLayoutEmpty(layout: HomepageLayout): boolean {
  return (
    !layout.hero &&
    layout.leftLead.length === 0 &&
    layout.centerList.length === 0 &&
    layout.centerFill.length === 0 &&
    layout.latest.length === 0 &&
    !layout.urgentLead &&
    layout.urgentGrid.length === 0 &&
    layout.showcase.length === 0 &&
    layout.lowerGrid.length === 0
  );
}
