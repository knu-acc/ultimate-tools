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
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Сравнение двух текстов по строкам. Показываются номера строк, которые отличаются. Всё в браузере, данные не отправляются.
      </p>
      <div className="result-card">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--foreground)]/70">Текст A и Текст B</span>
          {(textA || textB) ? (
            <div className="flex gap-2">
              <button type="button" onClick={swap} className="btn-ghost">Поменять местами</button>
              <button type="button" onClick={clearBoth} className="btn-ghost">Очистить оба</button>
            </div>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--foreground)]/70">Текст A</label>
              <span className="text-xs text-[var(--muted)]">{lineCountA} {t("lines") || "стр."}</span>
            </div>
            <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder={t("placeholder")} className="input-base font-mono text-sm min-h-[120px]" rows={5} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--foreground)]/70">Текст B</label>
              <span className="text-xs text-[var(--muted)]">{lineCountB} {t("lines") || "стр."}</span>
            </div>
            <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder={t("placeholder")} className="input-base font-mono text-sm min-h-[120px]" rows={5} />
          </div>
        </div>
      </div>
      {(linesA.length > 0 || linesB.length > 0) ? (
        <div className="space-y-2">
          {diffSummary && <div className="flex justify-end"><CopyButton text={diffSummary} label="Копировать отчёт" /></div>}
          <div className="result-card">
            {same ? (
              <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">{t("identical")}</p>
            ) : (
              <div className="space-y-1 text-sm">
                {onlyA.length > 0 && (
                  <p><span className="text-[var(--muted)]">{t("onlyInA")}:</span> <span className="tabular-nums">{onlyA.join(", ")}</span></p>
                )}
                {onlyB.length > 0 && (
                  <p><span className="text-[var(--muted)]">{t("onlyInB")}:</span> <span className="tabular-nums">{onlyB.join(", ")}</span></p>
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
