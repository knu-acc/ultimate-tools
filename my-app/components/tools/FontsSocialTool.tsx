"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const BOLD = "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭";
const ITALIC = "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡";
const SCRIPT = "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏";
const DOUBLE = "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ";
const FONTS: { name: string; getChar: (c: string) => string }[] = [
  {
    name: "Bold",
    getChar: (c) => {
      const idx = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c);
      return idx >= 0 ? BOLD[idx] : c;
    },
  },
  {
    name: "Italic",
    getChar: (c) => {
      const idx = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c);
      return idx >= 0 ? ITALIC[idx] : c;
    },
  },
  {
    name: "Script",
    getChar: (c) => {
      const idx = "abcdefghijklmnopqrstuvwxyz".indexOf(c.toLowerCase());
      return idx >= 0 ? SCRIPT[idx] : c;
    },
  },
  {
    name: "Double-struck",
    getChar: (c) => {
      const idx = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c);
      return idx >= 0 ? DOUBLE[idx] : c;
    },
  },
];

function convert(text: string, font: (typeof FONTS)[0]): string {
  return text
    .split("")
    .map((c) => font.getChar(c) || font.getChar(c.toLowerCase()) || c)
    .join("");
}

interface FontsSocialToolProps {
  t: (key: string) => string;
}

const PRESETS = ["Hello", "Cool", "Love", "Wow", "OK"];

export function FontsSocialTool({ t }: FontsSocialToolProps) {
  const [text, setText] = useState("Hello World");
  const allResults = FONTS.map((f) => ({ name: f.name, text: convert(text, f) }));
  const copyAllText = allResults.map((r) => r.text).join("\n");

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Стилизованный текст для соцсетей и никнеймов. Введите латиницу (A–Z, a–z) — ниже появятся варианты. Цифры и знаки копируются как есть.
      </p>
      <div className="result-card">
        <label className="field-label">
          Введите латиницу — ниже появятся стили
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            className="input-base flex-1 min-w-[200px]"
          />
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setText(preset)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--accent)]/10"
            >
              {preset}
            </button>
          ))}
        </div>
        {text && (
          <div className="mt-2 flex justify-end">
            <CopyButton text={copyAllText} label={t("copyAll") || "Копировать все варианты"} />
          </div>
        )}
      </div>
      <div className="space-y-4">
        {FONTS.map((font) => {
          const result = convert(text, font);
          return (
            <div key={font.name} className="result-card">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--foreground)]/70">{font.name}</span>
                {result ? <CopyButton text={result} label={`Копировать ${font.name}`} /> : null}
              </div>
              <div className="select-all text-xl leading-relaxed text-[var(--foreground)]">
                {result || <span className="text-[var(--muted)]">Введите латинский текст выше</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
