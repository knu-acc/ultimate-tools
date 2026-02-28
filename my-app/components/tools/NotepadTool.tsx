"use client";

import { useState, useEffect, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const STORAGE_KEY = "ultimate-tools-notepad";

interface NotepadToolProps {
  t: (key: string) => string;
}

export function NotepadTool({ t }: NotepadToolProps) {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return { chars: text.length, charsNoSpaces: text.replace(/\s/g, "").length, words, lines: text ? text.split(/\n/).length : 0 };
  }, [text]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setText(localStorage.getItem(STORAGE_KEY) ?? "");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, text);
    }
  }, [text]);

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
<textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="input-base min-h-[300px]"
        rows={12}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <span>{t("saved")}</span>
          {text && (
            <>
              <span>{stats.words} {t("words") || "слов"}</span>
              <span>{stats.chars} {t("chars") || "симв."}</span>
              <span>{stats.lines} {t("lines") || "стр."}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {text && (
            <button
              type="button"
              onClick={downloadTxt}
              className="btn-ghost"
            >
              {t("exportTxt") || "Скачать .txt"}
            </button>
          )}
          {text && <CopyButton text={text} label="Копировать всё" />}
        </div>
      </div>
    </div>
  );
}
