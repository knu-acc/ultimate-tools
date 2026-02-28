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
    const ts = parseInt(unix, 10);
    if (isNaN(ts)) return;
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
    if (!isNaN(ts)) return new Date(ts * 1000).toLocaleString();
    return null;
  })();
  const resolvedUnix = (() => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return String(Math.floor(d.getTime() / 1000));
    return null;
  })();

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Конвертация Unix timestamp (секунды) в дату/время и обратно. Удобно для логов и API.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("unix")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={unix}
            onChange={(e) => setUnix(e.target.value)}
            placeholder="1699999999"
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            onClick={unixToDate}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white"
          >
            →
          </button>
        </div>
        {resolvedDate && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-[var(--muted)]">Дата:</span>
            <span className="font-mono">{resolvedDate}</span>
            <CopyButton text={resolvedDate} label="Копировать дату" />
          </div>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("date")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            placeholder="2024-01-01 12:00:00"
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            onClick={dateToUnix}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white"
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
      <button
        onClick={() => {
          setUnix(String(Math.floor(Date.now() / 1000)));
          setDateStr(new Date().toLocaleString());
        }}
        className="rounded-xl border border-[var(--border)] px-4 py-2"
      >
        {t("now")}
      </button>
    </div>
  );
}
