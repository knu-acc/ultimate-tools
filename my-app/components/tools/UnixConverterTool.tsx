"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface UnixConverterToolProps {
  t: (key: string) => string;
}

export function UnixConverterTool({ t }: UnixConverterToolProps) {
  const [unix, setUnix] = useState("");
  const [dateStr, setDateStr] = useState("");

  const unixToDate = () => {
    let ts = parseInt(unix, 10);
    if (isNaN(ts)) return;
    if (ts > 1e12) ts = Math.floor(ts / 1000);
    const d = new Date(ts * 1000);
    setDateStr(d.toLocaleString());
  };

  const dateToUnix = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setUnix(String(Math.floor(d.getTime() / 1000)));
  };

  const resolvedDate = (() => {
    const ts = parseInt(unix, 10);
    if (isNaN(ts)) return null;
    const ms = ts > 1e12 ? ts : ts * 1000;
    return new Date(ms).toLocaleString();
  })();
  const resolvedUnix = (() => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return String(Math.floor(d.getTime() / 1000));
    return null;
  })();

  const setNow = () => {
    setUnix(String(Math.floor(Date.now() / 1000)));
    setDateStr(new Date().toLocaleString());
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Конвертация Unix timestamp (секунды с 01.01.1970 UTC) в дату/время и обратно. Миллисекунды (13 цифр) распознаются автоматически. Для логов и API.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--muted)]">{t("unix")}</label>
          <button type="button" onClick={setNow} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">
            {t("now")}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={unix}
            onChange={(e) => setUnix(e.target.value)}
            placeholder="1699999999 или 1699999999999"
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <button
            onClick={unixToDate}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90"
          >
            →
          </button>
        </div>
        {resolvedDate && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--muted)]">Дата:</span>
            <span className="font-mono">{resolvedDate}</span>
            <CopyButton text={resolvedDate} label="Копировать дату" />
            {(() => {
              const ts = parseInt(unix, 10);
              if (isNaN(ts)) return null;
              const t = (ts > 1e12 ? ts / 1000 : ts) * 1000;
              const diff = t - Date.now();
              if (diff > 0 && diff < 365 * 24 * 3600 * 1000) {
                const days = Math.floor(diff / (24 * 3600 * 1000));
                return <span className="text-xs text-[var(--muted)]">через {days} д.</span>;
              }
              return null;
            })()}
          </div>
        )}
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("date")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            placeholder="2024-01-01 12:00:00 или локальный формат"
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <button
            onClick={dateToUnix}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90"
          >
            →
          </button>
        </div>
        {resolvedUnix && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-[var(--muted)]">Unix:</span>
            <span className="font-mono">{resolvedUnix}</span>
            <CopyButton text={resolvedUnix} label="Копировать Unix" />
          </div>
        )}
      </div>
    </div>
  );
}
