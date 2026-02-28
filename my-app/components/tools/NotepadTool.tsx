"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

const STORAGE_KEY = "ultimate-tools-notepad";

interface NotepadToolProps {
  t: (key: string) => string;
}

export function NotepadTool({ t }: NotepadToolProps) {
  const [text, setText] = useState("");

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

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Блокнот с автосохранением в браузере. Текст сохраняется при вводе; можно скопировать всё одним нажатием.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[300px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={12}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--muted)]">{t("saved")}</p>
        {text && <CopyButton text={text} label="Копировать всё" />}
      </div>
    </div>
  );
}
