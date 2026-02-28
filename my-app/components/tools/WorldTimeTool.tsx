"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

const ZONES = [
  { name: "UTC", offset: 0 },
  { name: "Москва", offset: 3 },
  { name: "Алматы", offset: 6 },
  { name: "Лондон", offset: 0 },
  { name: "Нью-Йорк", offset: -5 },
  { name: "Токио", offset: 9 },
  { name: "Пекин", offset: 8 },
];

interface WorldTimeToolProps {
  t: (key: string) => string;
}

export function WorldTimeTool({ t }: WorldTimeToolProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const allLines = ZONES.map(({ name, offset }) => {
    const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
    const timeStr = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `${name}: ${timeStr}`;
  }).join("\n");

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">
        Текущее время в разных часовых поясах. Обновляется каждую секунду; можно скопировать одну строку или всё.
      </p>
      <div className="mb-2 flex justify-end">
        <CopyButton text={allLines} label="Копировать все зоны" />
      </div>
      {ZONES.map(({ name, offset }) => {
        const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
        const timeStr = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return (
          <div
            key={name}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
          >
            <span className="font-medium">{name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">{timeStr}</span>
              <CopyButton text={`${name}: ${timeStr}`} label={`Копировать ${name}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
