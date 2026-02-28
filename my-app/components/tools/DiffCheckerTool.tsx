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

  const diffSummary = (linesA.length > 0 || linesB.length > 0) && !same
    ? [onlyA.length > 0 ? `${t("onlyInA")}: ${onlyA.join(", ")}` : "", onlyB.length > 0 ? `${t("onlyInB")}: ${onlyB.join(", ")}` : ""].filter(Boolean).join("\n")
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Сравнение двух текстов по строкам. Показываются номера строк, которые отличаются в первом и во втором блоке.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("textA")}</label>
        <textarea
          value={textA}
          onChange={(e) => setTextA(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
          rows={5}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("textB")}</label>
        <textarea
          value={textB}
          onChange={(e) => setTextB(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
          rows={5}
        />
      </div>
      {(linesA.length > 0 || linesB.length > 0) ? (
        <div className="space-y-2">
          {diffSummary && <div className="flex justify-end"><CopyButton text={diffSummary} label="Копировать отчёт" /></div>}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            {same ? (
              <p className="text-sm text-[var(--muted)]">{t("identical")}</p>
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
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Вставьте или введите два фрагмента текста — отобразятся номера отличающихся строк.
        </p>
      )}
    </div>
  );
}
