"use client";

interface TrendingPillsProps {
  trends: Array<{ keyword: string; url: string }>;
}

export function TrendingPills({ trends }: TrendingPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
      {trends.map((item) => (
        <a
          key={item.keyword}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[var(--radius-pill)] whitespace-nowrap hover:bg-[var(--border)] transition-colors shrink-0"
        >
          {item.keyword}
        </a>
      ))}
    </div>
  );
}
