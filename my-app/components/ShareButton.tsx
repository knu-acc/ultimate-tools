"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  shareLabel: string;
  copyToast?: string;
  shareToast?: string;
  className?: string;
}

export function ShareButton({
  url,
  title,
  text,
  shareLabel,
  copyToast = "Скопировано",
  shareToast = "Поделено",
  className = "",
}: ShareButtonProps) {
  const { toast } = useToast();

  const handleClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title, text: text ?? title });
        toast(shareToast);
      } catch {
        copyFallback();
      }
    } else {
      copyFallback();
    }
  };

  const copyFallback = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      toast(copyToast);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/20 transition-colors ${className}`}
      aria-label={shareLabel}
    >
      <Share2 className="h-4 w-4" />
      {shareLabel}
    </button>
  );
}
