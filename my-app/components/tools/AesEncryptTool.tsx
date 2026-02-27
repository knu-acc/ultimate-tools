"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";

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
      {result && (
        <div
          className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          {result}
        </div>
      )}
    </div>
  );
}
