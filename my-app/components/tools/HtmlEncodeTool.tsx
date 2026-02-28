"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

interface HtmlEncodeToolProps {
  t: (key: string) => string;
}

export function HtmlEncodeTool({ t }: HtmlEncodeToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    setOutput(
      input.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c] ?? c)
    );
  };

  const decode = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = input;
      setOutput(textarea.value);
    } catch {
      setOutput(t("decodeError") || "Ошибка декодирования");
    }
  };

  const encodeAll = () => {
    setOutput(
      input
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code > 127) return `&#${code};`;
          return HTML_ENTITIES[c] ?? c;
        })
        .join("")
    );
  };

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="field-label">Исходный текст</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} className="input-base min-h-[120px] resize-y" rows={5} />
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="tool-action-bar"><button onClick={encode} className="btn-primary w-full sm:w-auto mt-2">{t("encode")}</button></div>
          <button onClick={decode} className="btn-secondary">{t("decode")}</button>
          <button onClick={encodeAll} className="btn-secondary" title="Все не-ASCII в &#NNN;">{t("encodeAll") || "Все символы → entities"}</button>
        </div>
      </div>
      {output ? (
        <div className="tool-output-zone">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]/70">Результат</span>
            <CopyButton text={output} label="Копировать" />
          </div>
          <div className="select-all rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all">
            {output}
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Введите текст и нажмите «Закодировать» или «Декодировать».
        </p>
      )}
    </div>
  );
}
