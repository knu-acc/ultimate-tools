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
    <div className="space-y-5">
      <div className="tool-action-bar">
        <button onClick={format} className="btn-primary">{t("format")}</button>
        <button onClick={minify} className="btn-secondary">{t("minify")}</button>
        <button onClick={validate} className="btn-secondary">{t("validate") || "Проверить"}</button>
        {input ? <button type="button" onClick={clearAll} className="btn-ghost ml-auto">Очистить</button> : null}
      </div>
      {valid === true && !output && <p className="text-sm text-green-600 dark:text-green-400">{t("validJson") || "JSON корректен."}</p>}
      {error && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{error}</div>}
      <div className="tool-split-pane">
        <div className="tool-input-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="input-base font-mono text-sm min-h-[250px] resize-y"
            rows={10}
          />
        </div>
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          {output && !error ? (
            <>
              <div className="mb-2 flex justify-end">
                <CopyButton text={output} label="Копировать JSON" />
              </div>
              <textarea readOnly value={output} className="input-base font-mono text-sm min-h-[250px] bg-[var(--background)] resize-y" rows={10} />
            </>
          ) : (
            <div className="empty-state min-h-[250px] flex items-center justify-center">
              Нажмите «Форматировать» или «Минифицировать» для результата.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
