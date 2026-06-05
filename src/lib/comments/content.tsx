import Link from "next/link";
import type { ReactNode } from "react";

const MENTION_PATTERN = /(^|[\s(])@([a-zA-Z0-9_]+)/g;

export function formatReplyContent(username: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return `javob berdi @${username}\n${trimmed}`;
}

export function CommentContent({ content }: { content: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(MENTION_PATTERN);

  while ((match = pattern.exec(content)) !== null) {
    const prefix = match[1] ?? "";
    const username = match[2];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(content.slice(lastIndex, start));
    }

    parts.push(prefix);
    parts.push(
      <Link
        key={`${username}-${start}`}
        href={`/profil/${username}`}
        className="font-medium text-nav-active hover:underline"
      >
        @{username}
      </Link>,
    );

    lastIndex = start + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return <span className="whitespace-pre-wrap">{parts}</span>;
}
