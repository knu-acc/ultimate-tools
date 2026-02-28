"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface UrlEncodeToolProps {
  t: (key: string) => string;
}

export function UrlEncodeTool({ t }: UrlEncodeToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [spaceAsPlus, setSpaceAsPlus] = useState(false);
  const [decodeError, setDecodeError] = useState("");

  const encode = () => {
    const encoded = encodeURIComponent(input);
    setOutput(spaceAsPlus ? encoded.replace(/%20/g, "+") : encoded);
  };

  const decode = () => {
    setDecodeError("");
    try {
      const normalized = spaceAsPlus ? input.replace(/\+/g, " ") : input;
      setOutput(decodeURIComponent(normalized));
    } catch {
      setOutput("");
      setDecodeError(t("invalidUrl") || "Недопустимая строка для декодирования");
    }
  };

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="mb-3 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={spaceAsPlus} onChange={(e) => setSpaceAsPlus(e.target.checked)} className="rounded" />
            {t("spaceAsPlus") || "Пробел как + (form-urlencoded)"}
          </label>
        </div>
        <label className="field-label">Строка</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} className="input-base min-h-[120px] resize-y" rows={5} />
        <div className="mt-3 flex gap-2">
          <div className="tool-action-bar"><button onClick={encode} className="btn-primary w-full sm:w-auto mt-2">{t("encode")}</button></div>
          <button onClick={decode} className="btn-secondary">{t("decode")}</button>
        </div>
      </div>
      {decodeError && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{decodeError}</div>}
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
        !decodeError && (
          <p className="empty-state">
            Введите строку и нажмите «Закодировать» или «Декодировать».
          </p>
        )
      )}
    </div>
  );
}
