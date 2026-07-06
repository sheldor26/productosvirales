"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 5.001L2 22l5.126-1.338a9.955 9.955 0 0 0 4.878 1.243h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.07a9.935 9.935 0 0 0-7.073-2.835zm4.883 12.09c-.248.694-1.226 1.29-1.797 1.375-.46.069-1.045.098-1.686-.106a15.31 15.31 0 0 1-1.51-.56c-2.667-1.152-4.408-3.85-4.542-4.028-.133-.178-1.09-1.451-1.09-2.767s.687-1.964.93-2.234c.242-.27.529-.338.706-.338l.507.01c.163.007.381-.062.596.454.223.535.756 1.848.822 1.982.067.135.111.293.022.47-.09.178-.135.288-.267.443-.134.155-.281.346-.4.464-.134.134-.273.28-.117.55.156.27.694 1.145 1.489 1.855.923.822 1.7 1.128 1.966 1.254.267.125.423.104.579-.062.155-.166.667-.777.845-1.043.178-.267.356-.222.6-.133.245.089 1.554.733 1.82.867.267.133.445.199.51.31.067.11.067.638-.181 1.332z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.878-6.43 2.523-8.475C5.845 1.205 8.598.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.512 5.467l-1.926.54c-1.104-3.953-3.854-5.98-8.176-6.03-2.93.022-5.145.929-6.583 2.7-1.348 1.66-2.045 4.043-2.07 7.086.025 3.014.723 5.376 2.07 7.037 1.436 1.766 3.653 2.674 6.585 2.699 2.638-.02 4.383-.647 5.828-2.098 1.646-1.653 1.618-3.68 1.086-4.923-.316-.74-.889-1.353-1.648-1.799-.19 1.353-.632 2.44-1.318 3.246-.912 1.075-2.19 1.66-3.795 1.734-1.221.057-2.398-.227-3.316-.803-1.089-.682-1.728-1.734-1.798-2.965-.068-1.204.401-2.32 1.322-3.144.882-.79 2.117-1.257 3.554-1.343 1.098-.066 2.11.001 3.02.196-.106-.622-.32-1.104-.635-1.44-.463-.494-1.152-.746-2.05-.752h-.024c-.885.006-1.616.256-2.174.744l-1.5-1.352c.965-.847 2.198-1.28 3.664-1.29h.03c1.483.01 2.687.483 3.582 1.404.783.807 1.267 1.936 1.44 3.36.895.44 1.66 1.043 2.243 1.786 1.084 1.383 1.336 3.383.68 5.34-.75 2.24-2.42 3.83-4.71 4.51-1.14.34-2.418.51-3.79.51z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.94 3.36 18.6 20.13c-.25 1.1-.9 1.37-1.82.86l-5.03-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.15 9.38-8.47c.41-.36-.09-.56-.63-.2L6.06 12.9.98 11.31c-1.1-.34-1.12-1.1.23-1.63L20.62 1.83c.92-.34 1.72.22 1.32 1.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.507 17.523 2 12 2S2 6.507 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.526 1.492-3.922 3.777-3.922 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.885h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const shareTargets = [
  {
    name: "WhatsApp",
    Icon: WhatsAppIcon,
    buildUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Threads",
    Icon: ThreadsIcon,
    buildUrl: (url: string, title: string) =>
      `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Facebook",
    Icon: FacebookIcon,
    buildUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    Icon: XIcon,
    buildUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    Icon: TelegramIcon,
    buildUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

/** Fila de íconos para compartir la página actual en las redes donde esta
 * audiencia realmente comparte y recomienda productos. */
export function ShareButtons({ title, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnClass =
    "inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {shareTargets.map(({ name, Icon, buildUrl }) => (
        <button
          key={name}
          type="button"
          aria-label={`Compartir por ${name}`}
          className={btnClass}
          onClick={() => {
            const url = window.location.href;
            window.open(buildUrl(url, title), "_blank", "noopener,noreferrer");
          }}
        >
          <Icon />
        </button>
      ))}
      <button
        type="button"
        aria-label="Copiar link"
        className={btnClass}
        onClick={handleCopy}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}
