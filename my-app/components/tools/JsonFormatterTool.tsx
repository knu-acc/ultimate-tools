"use client";

import { useState } from "react";

interface JsonFormatterToolProps {
  t: (key: string) => string;
}

export function JsonFormatterTool({ t }: JsonFormatterToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(t("invalidJson"));
    }
  };

  const minify = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(t("invalidJson"));
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm"
        rows={6}
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
        >
          {t("format")}
        </button>
        <button
          onClick={minify}
          className="rounded-xl border border-[var(--border)] px-4 py-2"
        >
          {t("minify")}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {output && !error && (
        <textarea
          readOnly
          value={output}
          className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm"
          rows={6}
        />
      )}
    </div>
  );
}
