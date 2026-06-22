import type { CSSProperties } from "react";

/** Mobil/planshet/desktop: 100% kenglik */
export const containerClassName =
  "mx-auto w-full min-w-0 max-w-full overflow-x-hidden px-0 md:px-4 xl:px-6 2xl:px-8";

/** Maqola o'qish va yozish — asosiy kontent maydoni */
export const articleSurfaceClassName =
  "w-full min-w-0 max-w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8";

/** Maqola feed sahifalari — sidebarlar yonida */
export const feedMainClassName =
  "w-full min-w-0 max-w-full px-3 py-0 md:px-4 lg:px-5";

/** Feed sahifalarida ustunlar bir xil balandlikda boshlanadi */
export const feedColumnTopPaddingClass = "md:pt-6 md:pb-6";

/** Sidebar, asosiy kontent va o'ng panel bir xil tepadan boshlanishi */
export const feedColumnAlignClassName = "flex flex-col md:pt-6 md:pb-6";

/** Feed ustunlari — mustaqil scroll, yashirin scrollbar */
export const feedColumnScrollClassName =
  "scrollbar-hidden min-w-0 md:h-full md:overflow-y-auto md:overscroll-contain";

export const sidebarWidthClass = "w-56";
export const rightSidebarWidthClass = "w-72";

/** App shell — chap sidebar, kontent, o'ng panel */
export const appShellGridClassName =
  "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_var(--right-sidebar-width)]";

export const appShellGridStyle: CSSProperties = {
  "--sidebar-width": "14rem",
  "--right-sidebar-width": "18rem",
} as CSSProperties;

/** Navbar icon tugmalari — light/dark hover */
export const navIconButtonClass =
  "text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/8";
