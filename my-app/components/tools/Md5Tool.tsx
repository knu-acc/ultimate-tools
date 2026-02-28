"use client";

import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { CopyButton } from "@/components/CopyButton";

interface Md5ToolProps {
  t: (key: string) => string;
}

export function Md5Tool({ t }: Md5ToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    setResult(input ? CryptoJS.MD5(input).toString() : "");
  }, [input, live]);

  const hash = () => {
    setResult(input ? CryptoJS.MD5(input).toString() : "");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        MD5-хеш в одну сторону. Подходит для контрольных сумм и проверки целостности; для паролей предпочтительнее SHA-256 или bcrypt.
      </p>
      <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
        {t("liveUpdate") || "Обновлять при вводе"}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={4}
      />
      <button
        onClick={hash}
        className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("hash")}
      </button>
      {input && <button type="button" onClick={() => { setInput(""); setResult(""); }} className="ml-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--border)]/20">{t("clear") || "Очистить"}</button>}
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={result} label="Копировать хеш" /></div>
          <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-sm break-all">
            {result}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст и нажмите «Хешировать» — MD5-хеш появится ниже.
        </p>
      )}
    </div>
  );
}
