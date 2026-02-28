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
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Конвертация Unix timestamp (секунды с 01.01.1970 UTC) в дату/время и обратно. Миллисекунды (13 цифр) распознаются автоматически. Для логов и API.
      </p>
      <div className="result-card">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground)]/70">{t("unix")}</label>
          <button type="button" onClick={setNow} className="btn-ghost">
            {t("now")}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={unix}
            onChange={(e) => setUnix(e.target.value)}
            placeholder="1699999999 или 1699999999999"
            className="input-base flex-1"
          />
          <button
            onClick={unixToDate}
            className="btn-primary w-full sm:w-auto mt-2"
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
      <div className="result-card">
        <label className="field-label">{t("date")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            placeholder="2024-01-01 12:00:00 или локальный формат"
            className="input-base flex-1"
          />
          <button
            onClick={dateToUnix}
            className="btn-primary w-full sm:w-auto mt-2"
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
