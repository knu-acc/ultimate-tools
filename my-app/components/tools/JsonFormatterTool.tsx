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

  const [valid, setValid] = useState<boolean | null>(null);

  const format = () => {
    setError("");
    setValid(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setValid(true);
    } catch (e) {
      setError(t("invalidJson"));
      setValid(false);
      const msg = (e as Error).message;
      const match = msg.match(/position (\d+)/i) || msg.match(/at position (\d+)/i);
      if (match) setError(`${t("invalidJson")} (${t("position") || "позиция"} ${match[1]})`);
    }
  };

  const minify = () => {
    setError("");
    setValid(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setValid(true);
    } catch (e) {
      setError(t("invalidJson"));
      setValid(false);
    }
  };

  const validate = () => {
    setError("");
    setOutput("");
    try {
      JSON.parse(input);
      setValid(true);
      setError("");
    } catch (e) {
      setValid(false);
      const msg = (e as Error).message;
      const match = msg.match(/position (\d+)/i) || msg.match(/at position (\d+)/i);
      setError(match ? `${t("invalidJson")} — ${t("position") || "позиция"} ${match[1]}` : t("invalidJson"));
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setValid(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Форматирование, минификация и проверка JSON в браузере. Данные никуда не отправляются. Вставьте JSON и нажмите нужную кнопку.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--muted)]">JSON</label>
          {input ? <button type="button" onClick={clearAll} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Очистить</button> : null}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value"}'
          className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          rows={6}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={format} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90">
            {t("format")}
          </button>
          <button onClick={minify} className="rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20">
            {t("minify")}
          </button>
          <button onClick={validate} className="rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20">
            {t("validate") || "Проверить"}
          </button>
        </div>
      </div>
      {valid === true && !output && <p className="text-sm text-green-600 dark:text-green-400">{t("validJson") || "JSON корректен."}</p>}
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
      {output && !error && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={output} label="Копировать JSON" />
          </div>
          <textarea readOnly value={output} className="min-h-[150px] w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm" rows={6} />
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
