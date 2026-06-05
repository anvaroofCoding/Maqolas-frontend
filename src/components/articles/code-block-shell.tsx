"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CodeBlockShellProps = {
  html: string;
};

export function CodeBlockShell({ html }: CodeBlockShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (isCopying || copied) return;

    const pre = contentRef.current?.querySelector("pre");
    const text =
      pre?.querySelector("code")?.textContent?.trim() ??
      pre?.textContent?.trim() ??
      "";

    if (!text) return;

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — no visual feedback
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="code-block-shell group relative">
      <button
        type="button"
        className={cn(
          "code-block-copy-btn",
          copied && "code-block-copy-btn--copied",
        )}
        aria-label={copied ? "Nusxalandi" : "Kodni nusxalash"}
        onClick={() => void handleCopy()}
      >
        {copied ? (
          <CheckIcon className="size-4" aria-hidden />
        ) : (
          <CopyIcon className="size-4" aria-hidden />
        )}
      </button>

      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
