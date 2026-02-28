"use client";

import { Copy } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface CopyButtonProps {
  text: string;
  label?: string;
  toastMessage?: string;
  className?: string;
}

export function CopyButton({ text, label, toastMessage = "Скопировано", className = "" }: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast(toastMessage);
    } catch {
      toast("Ошибка копирования");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/20 transition-colors ${className}`}
      aria-label={label ?? "Скопировать"}
    >
      <Copy className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
