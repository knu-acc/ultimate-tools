"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface DiffCheckerToolProps {
  t: (key: string) => string;
}

export function DiffCheckerTool({ t }: DiffCheckerToolProps) {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const onlyA: number[] = [];
  const onlyB: number[] = [];
  const maxLen = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLen; i++) {
    const a = linesA[i];
    const b = linesB[i];
    if (a !== b) {
      if (i < linesA.length) onlyA.push(i + 1);
      if (i < linesB.length) onlyB.push(i + 1);
    }
  }
  const same = onlyA.length === 0 && onlyB.length === 0 && (linesA.length > 0 || linesB.length > 0);
  const lineCountA = linesA.length;
  const lineCountB = linesB.length;

  const diffSummary = (linesA.length > 0 || linesB.length > 0) && !same
    ? [onlyA.length > 0 ? `${t("onlyInA")}: ${onlyA.join(", ")}` : "", onlyB.length > 0 ? `${t("onlyInB")}: ${onlyB.join(", ")}` : ""].filter(Boolean).join("\n")
    : "";

  const clearBoth = () => { setTextA(""); setTextB(""); };
  const swap = () => { setTextA(textB); setTextB(textA); };

  return (
    <div className="space-y-5">
      <div className="tool-action-bar">
        {(textA || textB) && (
          <>
            <button type="button" onClick={swap} className="btn-secondary">⇄ Поменять</button>
            <button type="button" onClick={clearBoth} className="btn-ghost">Очистить</button>
          </>
        )}
      </div>
      <div className="tool-split-pane">
        <div className="tool-input-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📝</span><span>Текст A</span><span className="ml-auto text-[var(--muted)] text-xs font-normal normal-case tracking-normal">{lineCountA} стр.</span></div>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder={t("placeholder")} className="input-base font-mono text-sm min-h-[200px] resize-y" rows={8} />
        </div>
        <div className="tool-input-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📝</span><span>Текст B</span><span className="ml-auto text-[var(--muted)] text-xs font-normal normal-case tracking-normal">{lineCountB} стр.</span></div>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder={t("placeholder")} className="input-base font-mono text-sm min-h-[200px] resize-y" rows={8} />
        </div>
      </div>
      {(linesA.length > 0 || linesB.length > 0) ? (
        <div className="space-y-2">
          {diffSummary && <div className="flex justify-end"><CopyButton text={diffSummary} label="Копировать отчёт" /></div>}
          <div className="tool-output-zone">
            <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
            {same ? (
              <div className="badge-success px-4 py-2.5 rounded-xl text-sm">✅ Тексты идентичны</div>
            ) : (
              <div className="space-y-1 text-sm">
                {onlyA.length > 0 && (
                  <p className="rounded-lg bg-[var(--danger-muted)] px-3 py-2"><span className="font-medium text-[var(--danger)]">{t("onlyInA")}:</span> <span className="tabular-nums">{onlyA.join(", ")}</span></p>
                )}
                {onlyB.length > 0 && (
                  <p className="rounded-lg bg-[var(--success-muted)] px-3 py-2"><span className="font-medium text-[var(--success)]">{t("onlyInB")}:</span> <span className="tabular-nums">{onlyB.join(", ")}</span></p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Вставьте или введите два фрагмента текста — отобразятся номера отличающихся строк.
        </p>
      )}
    </div>
  );
}
