"use client";

interface TrendingPillsProps {
  trends: Array<{ keyword: string; url: string }>;
}

export function TrendingPills({ trends }: TrendingPillsProps) {
  // Duplicar para loop seamless del marquee
  const loop = [...trends, ...trends];

  return (
    <div className="marquee-wrapper relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="marquee-track">
        {loop.map((item, idx) => (
          <a
            key={`${item.keyword}-${idx}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[var(--radius-pill)] whitespace-nowrap border border-[var(--border)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--text-primary)] transition-colors shrink-0"
          >
            {item.keyword}
          </a>
        ))}
      </div>
    </div>
  );
}
