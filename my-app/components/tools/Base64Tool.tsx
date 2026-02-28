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
      <p className="text-sm text-[var(--muted)]">
        Кодирование и декодирование Base64 в браузере. Текст и результат не отправляются на сервер. Опция URL Safe — для использования в URL (без +, /, =).
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Режим</span>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button onClick={() => setMode("encode")} className={`rounded-xl px-4 py-2 font-medium ${mode === "encode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}>
              {t("encode")}
            </button>
            <button onClick={() => setMode("decode")} className={`rounded-xl px-4 py-2 font-medium ${mode === "decode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}>
              {t("decode")}
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="rounded" />
            URL Safe
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--muted)]">{mode === "encode" ? t("encode") : t("decode")}</label>
          <div className="flex gap-2">
            {input && <button onClick={handleClear} className="rounded-lg border border-[var(--border)] px-2 py-1 text-sm hover:bg-[var(--border)]/20">Очистить</button>}
            <button onClick={handlePaste} className="rounded-lg border border-[var(--border)] px-2 py-1 text-sm hover:bg-[var(--border)]/20">Вставить</button>
          </div>
        </div>
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? t("textPlaceholder") || "Enter text to encode..." : t("base64Placeholder") || "Enter Base64 to decode..."}
          className="min-h-[160px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none resize-y"
          rows={5}
        />
      </div>
      </div>

      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>}

      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
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
