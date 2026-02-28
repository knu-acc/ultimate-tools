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
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Шифрование и расшифровка AES. Введите ключ и текст — сохраните ключ: без него расшифровка невозможна.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encrypt")}
          className={`rounded-xl px-4 py-2 ${mode === "encrypt" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("encrypt")}
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`rounded-xl px-4 py-2 ${mode === "decrypt" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("decrypt")}
        </button>
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("key")}</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        />
        {key.length > 0 && key.length < 8 && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{t("shortKey") || "Ключ менее 8 символов — рекомендуется длиннее."}</p>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={mode === "encrypt" ? t("textPlaceholder") : t("cipherPlaceholder")}
        className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={4}
      />
      <button
        onClick={process}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {mode === "encrypt" ? t("encrypt") : t("decrypt")}
      </button>
      <button type="button" onClick={() => { setText(""); setResult(""); }} className="ml-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--border)]/20">{t("clear") || "Очистить"}</button>
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={result} label="Копировать" /></div>
          <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-sm break-all">
            {result}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Выберите «Шифровать» или «Расшифровать», введите ключ и текст — нажмите кнопку действия.
        </p>
      )}
    </div>
  );
}
