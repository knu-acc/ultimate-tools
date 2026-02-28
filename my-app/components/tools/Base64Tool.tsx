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
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`rounded-xl px-4 py-2 font-medium transition-all ${mode === "encode" ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20" : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            {t("encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`rounded-xl px-4 py-2 font-medium transition-all ${mode === "decode" ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20" : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            {t("decode")}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)] cursor-pointer">
          <input 
            type="checkbox" 
            checked={urlSafe} 
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]" 
          />
          URL Safe
        </label>
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? t("textPlaceholder") || "Enter text to encode..." : t("base64Placeholder") || "Enter Base64 to decode..."}
          className="min-h-[160px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none resize-y"
          rows={5}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {input && (
            <button onClick={handleClear} className="text-xs px-2 py-1 rounded bg-[var(--border)]/50 hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Clear
            </button>
          )}
          <button onClick={handlePaste} className="text-xs px-2 py-1 rounded bg-[var(--border)]/50 hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            Paste
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium animate-in fade-in">{error}</div>}
      
      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>{t("inputLength") || "Ввод"}: {input.length} {t("chars") || "симв."}</span>
            <span>{t("resultLength") || "Результат"}: {result.length} {t("chars") || "симв."}</span>
          </div>
          <div className="relative group">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-muted)]/10 p-5 font-mono text-sm break-all text-[var(--foreground)] min-h-[100px]">
              {result}
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
