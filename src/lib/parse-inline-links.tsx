import Link from "next/link";
import type React from "react";

/**
 * Parses inline markdown in text strings:
 *   - [texto](url)   → link (next/link for internal, <a> + nofollow for external)
 *   - **texto**      → <strong>
 *
 * Bold can contain a link (**[texto](url)**) — the bold body is parsed recursively.
 */

const LINK_CLASS =
  "text-[var(--cta-bg)] underline underline-offset-2 decoration-1 hover:opacity-70 transition-opacity";

function renderLink(anchor: string, href: string, key: number): React.ReactNode {
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link key={key} href={href} className={LINK_CLASS}>
        {anchor}
      </Link>
    );
  }
  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={LINK_CLASS}
    >
      {anchor}
    </a>
  );
}

function renderText(text: string, startKey: { k: number }): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  // Match either **text** or [text](url) — bold takes priority so nested links work
  const re = /\*\*([\s\S]+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) {
      // Bold — recursively parse interior for links
      const inner = renderText(m[1], startKey);
      out.push(
        <strong
          key={startKey.k++}
          className="font-semibold text-[var(--text-primary)]"
        >
          {inner}
        </strong>
      );
    } else if (m[2] != null && m[3] != null) {
      out.push(renderLink(m[2], m[3], startKey.k++));
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function parseInlineLinks(text: string): React.ReactNode[] {
  const out = renderText(text, { k: 0 });
  return out.length > 0 ? out : [text];
}
