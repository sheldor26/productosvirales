import Link from "next/link";
import type React from "react";

/**
 * Parses inline markdown-style links [texto](url) in a text string.
 * Internal links (/producto/, /guias/, /categoria/) use next/link for client-side nav.
 * External links open in a new tab with nofollow sponsored rel.
 */
export function parseInlineLinks(text: string): React.ReactNode[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const [, anchor, href] = match;
    const isInternal = href.startsWith("/");
    const linkClass =
      "text-[var(--cta-bg)] underline underline-offset-2 decoration-1 hover:opacity-70 transition-opacity";

    if (isInternal) {
      result.push(
        <Link key={key++} href={href} className={linkClass}>
          {anchor}
        </Link>
      );
    } else {
      result.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className={linkClass}
        >
          {anchor}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}
