"use client";

import { useState, useEffect } from "react";

interface CountdownToolProps {
  t: (key: string) => string;
}

function formatDiff(ms: number): string {
  if (ms <= 0) return "0:00:00:00";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${d}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownTool({ t }: CountdownToolProps) {
  const [target, setTarget] = useState("");
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    if (!target) {
      setDiff(null);
      return;
    }
    const targetTime = new Date(target).getTime();
    const tick = () => {
      const now = Date.now();
      setDiff(Math.max(0, targetTime - now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">{t("target")}</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      {diff !== null && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-muted)] p-6 text-center">
          <div className="text-2xl font-mono font-semibold text-[var(--foreground)]">
            {formatDiff(diff)}
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("remaining")}</p>
        </div>
      )}
    </div>
  );
}
