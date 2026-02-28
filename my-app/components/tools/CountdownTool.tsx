"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

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

  const diffStr = diff !== null ? formatDiff(diff) : "";
  const copyLine = diff !== null ? `${t("remaining")}: ${diffStr}` : "";

  const setQuick = (hours: number) => {
    const d = new Date();
    d.setTime(d.getTime() + hours * 60 * 60 * 1000);
    setTarget(d.toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Обратный отсчёт до выбранной даты и времени. Укажите момент — отображается оставшееся время в днях, часах, минутах и секундах.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setQuick(1)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Через 1 ч</button>
        <button type="button" onClick={() => setQuick(24)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Через 24 ч</button>
        <button type="button" onClick={() => setQuick(24 * 7)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Через 7 д</button>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("target")}</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      {diff !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-muted)] p-6 text-center">
          <div className="text-2xl font-mono font-semibold text-[var(--foreground)]">{diffStr}</div>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("remaining")}</p>
          <div className="mt-3 flex justify-center">
            <CopyButton text={copyLine} label="Скопировать отсчёт" />
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Выберите дату и время — здесь появится обратный отсчёт.
        </p>
      )}
    </div>
  );
}
