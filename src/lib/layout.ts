import type { CSSProperties } from "react";

/** Sidebar va asosiy kontent orasidagi standart masofa */
export const FEED_COLUMN_GAP_PX = 10;

/** Mobil/planshet/desktop: 100% kenglik */
export const containerClassName =
  "mx-auto w-full min-w-0 max-w-full overflow-x-hidden px-0 md:px-4 xl:px-6 2xl:px-8";

/** Maqola o'qish va yozish — asosiy kontent maydoni (gorizontal padding app-shell beradi) */
export const articleSurfaceClassName =
  "w-full min-w-0 max-w-full px-0 py-6 sm:py-8";

/** Maqola yozish — ixchamroq, tepada ortiqcha bo'shliq yo'q */
export const writeSurfaceClassName =
  "w-full min-w-0 max-w-full px-3 py-1 sm:px-5 sm:py-2 md:px-6";

/** Yozish ustuni — feed paddingisiz */
export const writeColumnAlignClassName =
  "flex h-full min-h-0 flex-col pb-2 md:pb-3";

/** Feed sahifalari — gorizontal padding markaziy ustunda (app-shell) */
export const feedMainClassName = "w-full min-w-0 max-w-full pb-0 pt-0";

/** Maqola kartalari — mobil/planshet 1 ustun, keng ekranda 2 ustun */
export const articleFeedGridClassName =
  "grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2";

/** Feed ustunlari — mustaqil scroll, navbar ostidan boshlanadi */
export const feedColumnScrollClassName =
  "scrollbar-hidden min-w-0 pt-14 md:h-full md:overflow-y-auto md:overscroll-contain";

/** Yon panel ustunlari — sidebar / mashxur izohlar */
export const feedSidebarColumnClassName = "flex w-full min-w-0 flex-col pb-6 md:pt-6";

/**
 * Markaziy kontent ustuni — mobilda ekran cheti, desktopda sidebarlardan 10px (grid gap).
 */
export const feedMainColumnClassName =
  "flex w-full min-w-0 flex-col px-3 pb-6 pt-0 md:px-0 md:pt-6";

/** Footer va inset bloklar — devorga yopishmaslik uchun barqaror gorizontal padding */
export const feedContentInsetClassName = "px-4 sm:px-5 md:px-4 lg:px-5";

/** @deprecated feedSidebarColumnClassName yoki feedMainColumnClassName ishlating */
export const feedColumnAlignClassName = feedSidebarColumnClassName;

export const sidebarWidthClass = "w-56";
export const rightSidebarWidthClass = "w-72";

/** App shell — 2 ustun: sidebar + kontent */
export const appShellGridTwoColClassName =
  "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] md:gap-x-[10px]";

/** App shell — md: 2 ustun, lg: sidebar + kontent + mashxur izohlar */
export const appShellGridWithRightSidebarClassName =
  "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] md:gap-x-[10px] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_var(--right-sidebar-width)]";

/** @deprecated appShellGridWithRightSidebarClassName */
export const appShellGridThreeColClassName = appShellGridWithRightSidebarClassName;

/** @deprecated appShellGridTwoColClassName */
export const appShellGridClassName = appShellGridWithRightSidebarClassName;

export const appShellGridStyle: CSSProperties = {
  "--sidebar-width": "14rem",
  "--right-sidebar-width": "18rem",
  "--feed-column-gap": `${FEED_COLUMN_GAP_PX}px`,
} as CSSProperties;

/** Navbar icon tugmalari — light/dark hover */
export const navIconButtonClass =
  "text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/8";
