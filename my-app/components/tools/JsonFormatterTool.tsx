"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

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
      <p className="text-sm text-[var(--muted)]">
        Форматирование и минификация JSON. Вставьте валидный JSON и нажмите «Форматировать» или «Минифицировать» — результат можно скопировать.
      </p>
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
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
      {output && !error && (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={output} label="Копировать JSON" /></div>
          <textarea
            readOnly
            value={output}
            className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 font-mono text-sm"
            rows={6}
          />
        </div>
      )}
      {!output && !error && input.trim() && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Нажмите «Форматировать» или «Минифицировать» для результата.
        </p>
      )}
    </div>
  );
}
