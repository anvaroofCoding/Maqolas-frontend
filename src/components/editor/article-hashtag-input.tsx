"use client";

import { HashIcon, XIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Badge } from "@/components/ui/badge";
import { articlesApi } from "@/features/articles/api/articles-api";
import {
  getHashtagQuery,
  MAX_HASHTAGS,
  normalizeHashtag,
} from "@/lib/hashtags/normalize-hashtag";
import {
  getRecentHashtags,
  mergeHashtagSuggestions,
  rememberHashtags,
} from "@/lib/hashtags/recent-hashtags";
import { cn } from "@/lib/utils";

type ArticleHashtagInputProps = {
  value: string[];
  onChange: (hashtags: string[]) => void;
  className?: string;
};

export function ArticleHashtagInput({
  value,
  onChange,
  className,
}: ArticleHashtagInputProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestionData } = articlesApi.useGetHashtagSuggestionsQuery();

  const allSuggestions = useMemo(
    () =>
      mergeHashtagSuggestions(
        value,
        suggestionData?.hashtags,
        getRecentHashtags(),
      ),
    [suggestionData?.hashtags, value],
  );

  const query = getHashtagQuery(input);
  const filteredSuggestions = useMemo(() => {
    const selected = new Set(value);
    return allSuggestions.filter((tag) => {
      if (selected.has(tag)) return false;
      if (!query) return true;
      return tag.includes(query);
    });
  }, [allSuggestions, query, value]);

  const addTag = useCallback(
    (raw: string) => {
      const tag = normalizeHashtag(raw);
      if (!tag || value.includes(tag)) {
        setInput("");
        setOpen(false);
        return;
      }
      if (value.length >= MAX_HASHTAGS) return;

      const next = [...value, tag];
      onChange(next);
      rememberHashtags([tag]);
      setInput("");
      setOpen(false);
      setActiveIndex(0);
    },
    [onChange, value],
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((item) => item !== tag));
    },
    [onChange, value],
  );

  const tryCommitInput = useCallback(() => {
    if (!input.trim()) return;
    addTag(input);
  }, [addTag, input]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!filteredSuggestions.length) return;
      setOpen(true);
      setActiveIndex((index) => (index + 1) % filteredSuggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!filteredSuggestions.length) return;
      setOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? filteredSuggestions.length - 1 : index - 1,
      );
      return;
    }

    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      if (open && filteredSuggestions[activeIndex]) {
        event.preventDefault();
        addTag(filteredSuggestions[activeIndex]);
        return;
      }
      if (input.trim()) {
        event.preventDefault();
        tryCommitInput();
      }
      return;
    }

    if (event.key === " " && input.trim()) {
      event.preventDefault();
      tryCommitInput();
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, filteredSuggestions.length]);

  const atLimit = value.length >= MAX_HASHTAGS;

  return (
    <div
      ref={containerRef}
      className={cn(
        "border-t border-border/60 px-3 py-3 sm:px-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <HashIcon className="size-3.5" />
        <span>Hashtaglar</span>
        <span className="font-normal">
          ({value.length}/{MAX_HASHTAGS})
        </span>
      </div>

      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-2 py-1.5",
          atLimit && "opacity-80",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 text-xs"
          >
            #{tag}
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-background/60"
              aria-label={`${tag} hashtagini olib tashlash`}
              onClick={(event) => {
                event.stopPropagation();
                removeTag(tag);
              }}
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}

        {!atLimit ? (
          <div className="relative min-w-[8rem] flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => {
                let next = event.target.value;
                if (next.length > 0 && !next.startsWith("#")) {
                  next = `#${next.replace(/^#+/, "")}`;
                }
                setInput(next);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                window.setTimeout(() => {
                  if (input.trim()) tryCommitInput();
                }, 120);
              }}
              placeholder={value.length ? "#yana..." : "#hashtag yozing..."}
              className="w-full min-w-0 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Hashtag yozish"
              autoComplete="off"
              spellCheck={false}
            />

            {open && filteredSuggestions.length > 0 ? (
              <div className="absolute bottom-full left-0 z-50 mb-1 max-h-44 w-[min(100%,16rem)] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
                {filteredSuggestions.slice(0, 8).map((tag, index) => (
                  <button
                    key={tag}
                    type="button"
                    className={cn(
                      "flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
                      index === activeIndex && "bg-muted",
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => addTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
