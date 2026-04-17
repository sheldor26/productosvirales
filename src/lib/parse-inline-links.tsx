import Link from "next/link";
import type React from "react";

/**
 * Parses inline markdown in text strings:
 *   - [texto](url)   → link (next/link for internal, <a> + nofollow for external)
 *   - **texto**      → <strong>
 *
 * Tokenized sequentially so order of occurrence is preserved.
 */

type Token =
  | { kind: "text"; value: string }
  | { kind: "link"; anchor: string; href: string }
  | { kind: "bold"; value: string };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Match either [text](url) or **text** — non-greedy inner
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ kind: "text", value: text.slice(last, m.index) });
    if (m[1] != null && m[2] != null) {
      tokens.push({ kind: "link", anchor: m[1], href: m[2] });
    } else if (m[3] != null) {
      tokens.push({ kind: "bold", value: m[3] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", value: text.slice(last) });
  return tokens;
}

export function parseInlineLinks(text: string): React.ReactNode[] {
  const linkClass =
    "text-[var(--cta-bg)] underline underline-offset-2 decoration-1 hover:opacity-70 transition-opacity";
  const tokens = tokenize(text);
  const out: React.ReactNode[] = [];
  let key = 0;

  for (const t of tokens) {
    if (t.kind === "text") {
      out.push(t.value);
    } else if (t.kind === "bold") {
      out.push(
        <strong key={key++} className="font-semibold text-[var(--text-primary)]">
          {t.value}
        </strong>
      );
    } else {
      const isInternal = t.href.startsWith("/");
      if (isInternal) {
        out.push(
          <Link key={key++} href={t.href} className={linkClass}>
            {t.anchor}
          </Link>
        );
      } else {
        out.push(
          <a
            key={key++}
            href={t.href}
            target="_blank"
            rel="nofollow sponsored noopener"
            className={linkClass}
          >
            {t.anchor}
          </a>
        );
      }
    }
  }

  return out.length > 0 ? out : [text];
}
