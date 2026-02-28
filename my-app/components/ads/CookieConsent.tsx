"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const { consent, accept, decline } = useAdsConsent();

  if (consent !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-[var(--background)] border-t border-[var(--border)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      role="dialog"
      aria-label="Согласие на использование cookie"
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-[var(--accent-muted)]/30 shrink-0">
            <Cookie className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)] mb-0.5">
              Мы используем cookie для показа рекламы и анализа трафика
            </p>
            <p className="text-xs text-[var(--muted)]">
              Продолжая, вы соглашаетесь с использованием cookie. Можно отключить в настройках браузера.{" "}
              <a href="/privacy" className="underline hover:text-[var(--foreground)]">Политика конфиденциальности</a>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent-muted)]/20 transition-colors"
          >
            Только необходимое
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity font-medium"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
