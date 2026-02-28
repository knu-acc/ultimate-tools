"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface RegexTesterToolProps {
  t: (key: string) => string;
}

export function RegexTesterTool({ t }: RegexTesterToolProps) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { matches, highlightRanges, error } = useMemo(() => {
    if (!pattern || !text) return { matches: [] as string[], highlightRanges: [] as [number, number][], error: "" };
    try {
      const re = new RegExp(pattern, flags);
      const m = text.match(re);
      const list = m ? (Array.isArray(m) ? m : [m]).filter(Boolean) : [];
      const ranges: [number, number][] = [];
      let match;
      const re2 = new RegExp(pattern, flags);
      while ((match = re2.exec(text)) !== null) {
        ranges.push([match.index, match.index + match[0].length]);
        if (!re2.global) break;
      }
      return { matches: list, highlightRanges: ranges, error: "" };
    } catch {
      return { matches: [] as string[], highlightRanges: [] as [number, number][], error: t("invalidRegex") };
    }
  }, [pattern, flags, text, t]);

  const matchesLine = matches.join(", ");
  const matchCount = matches.length;
  const flagPresets = [
    { label: "g", value: "g" },
    { label: "gi", value: "gi" },
    { label: "gm", value: "gm" },
    { label: "gim", value: "gim" },
  ];

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="field-label">{t("pattern")}</label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\d+"
            className="input-base font-mono min-w-0 flex-1"
          />
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g"
            className="input-base font-mono w-14 text-center"
            title="Флаги: g, i, m, s, u, y"
          />
          <div className="flex gap-1">
            {flagPresets.map(({ label, value }) => (
              <button key={label} type="button" onClick={() => setFlags(value)} className={`chip font-mono ${flags === value ? "chip-active" : ""}`} title={`Флаги: ${value}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">📝</span><span>Текст</span></div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t("textPlaceholder")} className="input-base font-mono text-sm min-h-[150px] resize-y" rows={6} />
      </div>
      {error && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{error}</div>}
      {pattern && text && !error && (
        <div className="tool-output-zone">
          <div className="tool-zone-header">
            <span className="tool-zone-icon">📊</span>
            <span>Результат</span>
            {matchCount > 0 && <span className="ml-auto rounded-full bg-[var(--accent)] text-white text-xs font-bold px-2 py-0.5">{matchCount}</span>}
          </div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="section-label mb-0">{t("matches")}</span>
            {matches.length > 0 && <CopyButton text={matchesLine} label="Копировать совпадения" />}
          </div>
          {text && highlightRanges.length > 0 && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm whitespace-pre-wrap break-words">
              {highlightRanges.reduce<React.ReactNode[]>((acc, [start, end], i) => {
                const prev = i === 0 ? 0 : highlightRanges[i - 1][1];
                if (prev < start) acc.push(<span key={`t-${i}`}>{text.slice(prev, start)}</span>);
                acc.push(<mark key={i} className="bg-[var(--accent)]/30 rounded px-0.5">{text.slice(start, end)}</mark>);
                return acc;
              }, [])}
              {highlightRanges[highlightRanges.length - 1]?.[1] < text.length && (
                <span key="tail">{text.slice(highlightRanges[highlightRanges.length - 1][1])}</span>
              )}
            </div>
          )}
          {matches.length > 0 && (
            <div className="mt-3">
              <div className="mb-2 text-sm font-medium text-[var(--muted)]">Список совпадений</div>
              <div className="flex flex-wrap gap-2">
                {matches.map((m, i) => (
                  <span key={i} className="rounded-lg bg-[var(--accent)]/20 px-2 py-1 font-mono">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pattern && text && matches.length === 0 && !highlightRanges.length && (
            <p className="mt-2 text-sm text-[var(--muted)]">Совпадений не найдено</p>
          )}
        </div>
      )}
      {(!pattern || !text) && !error && (
        <p className="empty-state">
          Введите регулярное выражение и текст — совпадения подсветятся автоматически.
        </p>
      )}
    </div>
  );
}
