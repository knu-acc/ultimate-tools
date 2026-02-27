"use client";

import { useState, useEffect } from "react";

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

  return (
    <div className="space-y-4">
      {ZONES.map(({ name, offset }) => {
        const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
        return (
          <div
            key={name}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4"
          >
            <span>{name}</span>
            <span className="font-mono text-lg">
              {d.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
