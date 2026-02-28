"use client";

import { useEffect, useState } from "react";
import { X, ShieldAlert } from "lucide-react";

export function AdBlockDetector() {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Basic AdBlock detection logic
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox"; // Common adblock block class
    testAd.style.height = "1px";
    testAd.style.width = "1px";
    testAd.style.position = "absolute";
    testAd.style.left = "-1000px";
    testAd.style.top = "-1000px";

    document.body.appendChild(testAd);

    setTimeout(() => {
      if (testAd.offsetHeight === 0 || testAd.style.display === "none") {
        setIsAdBlockActive(true);
      }
      testAd.remove();
    }, 500);
  }, []);

  if (!isAdBlockActive || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-[var(--background)] shadow-2xl p-4 border border-[var(--border)] rounded-xl z-50 animate-in slide-in-from-bottom">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-[var(--accent-muted)] rounded-lg text-amber-500">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1">Вы используете AdBlock</h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
            Мы делаем полезные онлайн инструменты бесплатно. Пожалуйста, отключите блокировщик или поддержите проект, чтобы мы могли развиваться дальше.
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-all"
          >
            Понятно, спасибо
          </button>
        </div>
      </div>
    </div>
  );
}
