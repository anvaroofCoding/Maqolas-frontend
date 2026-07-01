"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CodeXmlIcon,
  CopyIcon,
  ExternalLinkIcon,
  HomeIcon,
  MoonIcon,
  PenLineIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
  SunIcon,
  TagIcon,
  TerminalIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArticleSearchDialog } from "@/components/layout/article-search-dialog";
import { useArticlePhrase } from "@/components/saved-phrases/article-phrase-context";
import { SaveSuccessTick } from "@/components/saved-phrases/save-success-tick";
import { useSaveSelectedPhrase } from "@/components/saved-phrases/use-save-selected-phrase";
import { useSettings } from "@/components/providers/settings-provider";
import {
  ContextMenuItem,
  ContextMenuPanel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu-panel";
import { siteConfig } from "@/config/site";
import {
  devToolsShortcutHints,
  inspectElement,
  openBrowserConsole,
} from "@/lib/devtools/open-browser-devtools";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";

type MenuContext = {
  selectedText: string;
  linkUrl: string | null;
  imageUrl: string | null;
};

const SKIP_SELECTOR =
  '.ProseMirror, input, textarea, select, [contenteditable="true"], [data-native-context-menu], [role="textbox"], [role="combobox"], [role="searchbox"]';

function shouldSkipNativeMenu(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return Boolean(target.closest(SKIP_SELECTOR));
}

function readMenuContext(target: Element): MenuContext {
  const selection = window.getSelection()?.toString().trim() ?? "";
  const link = target.closest("a[href]");
  const image = target.closest("img[src]");

  return {
    selectedText: selection,
    linkUrl: link instanceof HTMLAnchorElement ? link.href : null,
    imageUrl: image instanceof HTMLImageElement ? image.currentSrc || image.src : null,
  };
}

async function copyText(value: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(successMessage);
    return true;
  } catch {
    toast.error("Nusxa olishda xatolik");
    return false;
  }
}

export function SiteContextMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { openSettings } = useSettings();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const articlePhrase = useArticlePhrase();
  const { savePhrase, showTick, dismissTick } = useSaveSelectedPhrase();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuContext, setMenuContext] = useState<MenuContext>({
    selectedText: "",
    linkUrl: null,
    imageUrl: null,
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element | null>(null);
  const devHints = devToolsShortcutHints();

  const close = useCallback(() => setOpen(false), []);

  const openSearch = useCallback((query = "") => {
    setSearchQuery(query);
    setSearchOpen(true);
    close();
  }, [close]);

  const run = useCallback(
    (action: () => void) => {
      action();
      close();
    },
    [close],
  );

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (shouldSkipNativeMenu(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;

      event.preventDefault();
      targetRef.current = event.target;
      setMenuContext(readMenuContext(event.target));
      setPosition({ x: event.clientX, y: event.clientY });
      setOpen(true);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${siteConfig.url}${pathname ?? ""}`;

  const isDark = resolvedTheme === "dark";
  const hasSelection = menuContext.selectedText.length > 0;
  const hasLink = Boolean(menuContext.linkUrl);
  const hasImage = Boolean(menuContext.imageUrl);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: siteConfig.tagline,
      url: pageUrl,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        close();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          close();
          return;
        }
      }
    }

    await copyText(pageUrl, "Sahifa havolasi nusxalandi");
    close();
  };

  return (
    <>
      {open ? (
        <ContextMenuPanel menuRef={menuRef} position={position}>
        {hasSelection ? (
          <>
            <ContextMenuItem
              icon={<CopyIcon />}
              label="Tanlangan matnni nusxalash"
              onClick={() =>
                run(() => {
                  void copyText(menuContext.selectedText, "Matn nusxalandi");
                })
              }
            />
            <ContextMenuItem
              icon={<SearchIcon />}
              label="Tanlangan matn bo'yicha qidirish"
              onClick={() => openSearch(menuContext.selectedText)}
            />
            {articlePhrase && isAuthenticated ? (
              <ContextMenuItem
                icon={<BookmarkIcon />}
                label="Iborani saqlash"
                onClick={() =>
                  run(() => {
                    void savePhrase(
                      articlePhrase.articleId,
                      menuContext.selectedText,
                    );
                  })
                }
              />
            ) : null}
            <ContextMenuSeparator />
          </>
        ) : null}

        {hasLink ? (
          <>
            <ContextMenuItem
              icon={<CopyIcon />}
              label="Havolani nusxalash"
              onClick={() =>
                run(() => {
                  void copyText(menuContext.linkUrl!, "Havola nusxalandi");
                })
              }
            />
            <ContextMenuItem
              icon={<ExternalLinkIcon />}
              label="Havolani yangi oynada ochish"
              onClick={() =>
                run(() => {
                  window.open(menuContext.linkUrl!, "_blank", "noopener,noreferrer");
                })
              }
            />
            <ContextMenuSeparator />
          </>
        ) : null}

        {hasImage ? (
          <>
            <ContextMenuItem
              icon={<CopyIcon />}
              label="Rasm manzilini nusxalash"
              onClick={() =>
                run(() => {
                  void copyText(menuContext.imageUrl!, "Rasm manzili nusxalandi");
                })
              }
            />
            <ContextMenuItem
              icon={<ExternalLinkIcon />}
              label="Rasmni yangi oynada ochish"
              onClick={() =>
                run(() => {
                  window.open(menuContext.imageUrl!, "_blank", "noopener,noreferrer");
                })
              }
            />
            <ContextMenuSeparator />
          </>
        ) : null}

        <ContextMenuItem
          icon={<CopyIcon />}
          label="Sahifa havolasini nusxalash"
          onClick={() =>
            run(() => {
              void copyText(pageUrl, "Sahifa havolasi nusxalandi");
            })
          }
        />
        <ContextMenuItem
          icon={<Share2Icon />}
          label="Ulashish"
          onClick={() => {
            void handleShare();
          }}
        />
        <ContextMenuSeparator />

        <ContextMenuItem
          icon={<SearchIcon />}
          label="Maqolalarni qidirish"
          hint="Ctrl+K"
          onClick={() => openSearch()}
        />
        <ContextMenuItem
          icon={<PenLineIcon />}
          label="Yangi maqola yozish"
          onClick={() =>
            run(() => {
              router.push("/yozish");
            })
          }
        />
        <ContextMenuItem
          icon={<HomeIcon />}
          label="Bosh sahifa"
          onClick={() =>
            run(() => {
              router.push("/");
            })
          }
        />
        <ContextMenuItem
          icon={<TagIcon />}
          label="Mavzular"
          onClick={() =>
            run(() => {
              router.push("/mavzular");
            })
          }
        />
        {isAuthenticated ? (
          <ContextMenuItem
            icon={<BookmarkIcon />}
            label="Mening maqolam"
            onClick={() =>
              run(() => {
                router.push("/lenta");
              })
            }
          />
        ) : null}

        <ContextMenuSeparator />

        <ContextMenuItem
          icon={<SettingsIcon />}
          label="Sozlamalar"
          onClick={() =>
            run(() => {
              openSettings();
            })
          }
        />
        <ContextMenuItem
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          label={isDark ? "Yorug' rejim" : "Qorong'i rejim"}
          onClick={() =>
            run(() => {
              setTheme(isDark ? "light" : "dark");
              toast.success(isDark ? "Yorug' rejim yoqildi" : "Qorong'i rejim yoqildi");
            })
          }
        />

        <ContextMenuSeparator />

        <ContextMenuItem
          icon={<TerminalIcon />}
          label="Consoleni ko'rish"
          hint={devHints.console}
          onClick={() =>
            run(() => {
              const opened = openBrowserConsole();
              if (!opened) {
                toast.info(`Konsol: ${devHints.console} yoki F12`);
              }
            })
          }
        />
        <ContextMenuItem
          icon={<CodeXmlIcon />}
          label="Inspect code"
          hint={devHints.inspect}
          onClick={() =>
            run(() => {
              const target = targetRef.current;
              if (!(target instanceof Element)) {
                toast.error("Element topilmadi");
                return;
              }

              const { selector, devToolsOpen } = inspectElement(target);
              openBrowserConsole();
              if (!devToolsOpen) {
                toast.info(
                  `Inspect: ${devHints.inspect}. Element: ${selector}`,
                );
              } else {
                toast.success(`Element konsolda: ${selector}`);
              }
            })
          }
        />

        <ContextMenuSeparator />

        <ContextMenuItem
          icon={<ArrowLeftIcon />}
          label="Orqaga"
          onClick={() =>
            run(() => {
              router.back();
            })
          }
        />
        <ContextMenuItem
          icon={<ArrowRightIcon />}
          label="Oldinga"
          onClick={() =>
            run(() => {
              router.forward();
            })
          }
        />
        <ContextMenuItem
          icon={<RefreshCwIcon />}
          label="Sahifani yangilash"
          onClick={() =>
            run(() => {
              router.refresh();
            })
          }
        />
      </ContextMenuPanel>
      ) : null}

      <ArticleSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        initialQuery={searchQuery}
      />
      {showTick ? <SaveSuccessTick onComplete={dismissTick} /> : null}
    </>
  );
}
