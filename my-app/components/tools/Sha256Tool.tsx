"use client";

import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { CopyButton } from "@/components/CopyButton";

interface Sha256ToolProps {
  t: (key: string) => string;
}

export function Sha256Tool({ t }: Sha256ToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    setResult(input ? CryptoJS.SHA256(input).toString() : "");
  }, [input, live]);

  const hash = () => setResult(input ? CryptoJS.SHA256(input).toString() : "");

  return (
    <div className="space-y-5">
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3">
          <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
          {t("liveUpdate") || "Обновлять при вводе"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[120px] resize-y"
          rows={4}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={hash} className="btn-primary">{t("hash")}</button>
          {input && <button type="button" onClick={() => { setInput(""); setResult(""); }} className="btn-ghost">{t("clear") || "Очистить"}</button>}
        </div>
      </div>
      {result ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">🔐</span><span>SHA-256 хеш</span></div>
          <div className="flex justify-end mb-2"><CopyButton text={result} label="Копировать хеш" /></div>
          <div className="secure-output select-all">{result}</div>
        </div>
      ) : (
        <p className="empty-state">
          Введите текст и нажмите «Хешировать» — SHA-256 хеш появится ниже.
        </p>
      )}
    </div>
  );
}
