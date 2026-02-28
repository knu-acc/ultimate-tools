"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { CopyButton } from "@/components/CopyButton";

interface AesEncryptToolProps {
  t: (key: string) => string;
}

export function AesEncryptTool({ t }: AesEncryptToolProps) {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const process = () => {
    try {
      if (mode === "encrypt") {
        setResult(CryptoJS.AES.encrypt(text, key).toString());
      } else {
        const bytes = CryptoJS.AES.decrypt(text, key);
        setResult(bytes.toString(CryptoJS.enc.Utf8) || t("wrongKey"));
      }
    } catch {
      setResult(t("error"));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encrypt")}
          className={`chip ${mode === "encrypt" ? "chip-active" : ""}`}
        >
          🔒 {t("encrypt")}
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`chip ${mode === "decrypt" ? "chip-active" : ""}`}
        >
          🔓 {t("decrypt")}
        </button>
      </div>
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">🔑</span><span>Ключ и данные</span></div>
        <div className="mb-4">
          <label className="field-label">{t("key")}</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="input-base"
          />
          {key.length > 0 && key.length < 8 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{t("shortKey") || "Ключ менее 8 символов — рекомендуется длиннее."}</p>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === "encrypt" ? t("textPlaceholder") : t("cipherPlaceholder")}
          className="input-base min-h-[120px] resize-y font-mono text-sm"
          rows={4}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={process} className="btn-primary">{mode === "encrypt" ? t("encrypt") : t("decrypt")}</button>
          <button type="button" onClick={() => { setText(""); setResult(""); }} className="btn-ghost">{t("clear") || "Очистить"}</button>
        </div>
      </div>
      {result ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">🔐</span><span>{mode === "encrypt" ? "Шифротекст" : "Расшифровано"}</span></div>
          <div className="flex justify-end mb-2"><CopyButton text={result} label="Копировать" /></div>
          <div className="secure-output select-all">{result}</div>
        </div>
      ) : (
        <p className="empty-state">
          Выберите «Шифровать» или «Расшифровать», введите ключ и текст — нажмите кнопку действия.
        </p>
      )}
    </div>
  );
}
