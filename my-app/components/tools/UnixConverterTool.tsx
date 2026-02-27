"use client";

import { useState } from "react";

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

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("unix")}</label>
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
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
          >
            →
          </button>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("date")}</label>
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
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
          >
            →
          </button>
        </div>
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
