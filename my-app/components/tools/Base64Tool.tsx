"use client";

import { useState } from "react";

interface Base64ToolProps {
  t: (key: string) => string;
}

export function Base64Tool({ t }: Base64ToolProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    try {
      if (mode === "encode") {
        setResult(btoa(unescape(encodeURIComponent(input))));
      } else {
        setResult(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      setError(t("invalidInput"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-xl px-4 py-2 ${mode === "encode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("encode")}
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-xl px-4 py-2 ${mode === "decode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("decode")}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? t("textPlaceholder") : t("base64Placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm"
        rows={5}
      />
      <button
        onClick={process}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {mode === "encode" ? t("encode") : t("decode")}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {result && !error && (
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
