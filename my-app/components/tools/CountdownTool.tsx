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

  const quickPresets = [
    { hours: 1, label: "Через 1 ч" },
    { hours: 3, label: "Через 3 ч" },
    { hours: 24, label: "Через 24 ч" },
    { hours: 24 * 7, label: "Через 7 д" },
    { hours: 24 * 30, label: "Через 30 д" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Обратный отсчёт до выбранной даты и времени. Формат: дни : часы : минуты : секунды. Обновляется каждую секунду. Работает только при открытой вкладке.
      </p>
      <div className="result-card">
        <span className="field-label">Быстрый выбор</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPresets.map(({ hours, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setQuick(hours)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--border)]/20"
            >
              {label}
            </button>
          ))}
        </div>
        <label className="field-label">{t("target")}</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="input-base"
        />
      </div>
      {diff !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">
          <div className="text-2xl font-mono font-semibold text-[var(--accent)]">{diffStr}</div>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("remaining")} (д:ч:м:с)</p>
          <div className="mt-3 flex justify-center">
            <CopyButton text={copyLine} label="Скопировать отсчёт" />
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Выберите дату и время или нажмите быстрый выбор — здесь появится обратный отсчёт.
        </p>
      )}
    </div>
  );
}
