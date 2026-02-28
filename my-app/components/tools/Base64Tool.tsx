"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

interface Base64ToolProps {
  t: (key: string) => string;
}

export function Base64Tool({ t }: Base64ToolProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!input) {
      setResult("");
      setError("");
      return;
    }

    setError("");
    try {
      if (mode === "encode") {
        let res = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) {
          res = res.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        setResult(res);
      } else {
        let val = input;
        if (urlSafe) {
          val = input.replace(/-/g, "+").replace(/_/g, "/");
          while (val.length % 4) {
            val += "=";
          }
        }
        setResult(decodeURIComponent(escape(atob(val))));
      }
    } catch (e) {
      setResult("");
      if (mode === "decode") {
        setError(t("invalidInput") || "Invalid Base64 string");
      }
    }
  }, [input, mode, urlSafe, t]);

  const handleClear = () => {
    setInput("");
    setResult("");
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Кодирование и декодирование Base64 в браузере. Текст и результат не отправляются на сервер. Опция URL Safe — для использования в URL (без +, /, =).
      </p>
      <div className="result-card">
        <span className="section-label">Режим</span>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button onClick={() => setMode("encode")} className={`chip ${mode === "encode" ? "chip-active" : ""}`}>
              {t("encode")}
            </button>
            <button onClick={() => setMode("decode")} className={`chip ${mode === "decode" ? "chip-active" : ""}`}>
              {t("decode")}
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="rounded" />
            URL Safe
          </label>
        </div>
      </div>

      <div className="result-card">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground)]/70">{mode === "encode" ? t("encode") : t("decode")}</label>
          <div className="flex gap-2">
            {input && <button onClick={handleClear} className="btn-ghost">Очистить</button>}
            <button onClick={handlePaste} className="btn-ghost">Вставить</button>
          </div>
        </div>
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? t("textPlaceholder") || "Enter text to encode..." : t("base64Placeholder") || "Enter Base64 to decode..."}
          className="min-h-[160px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-base font-mono text-sm focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent)]/30 ring-offset-2 ring-offset-[var(--card-bg)] dark:ring-offset-[var(--card-bg)] transition-all outline-none resize-y"
          rows={5}
        />
      </div>
      </div>

      {error && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{error}</div>}

      {result && (
        <div className="result-card">
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("inputLength") || "Ввод"}: {input.length} · {t("resultLength") || "Результат"}: {result.length}</span>
            <CopyButton text={result} label="Копировать" />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all min-h-[80px]">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
