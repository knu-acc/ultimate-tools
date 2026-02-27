"use client";

import { useState } from "react";

const BOLD = "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭";
const ITALIC = "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡";
const SCRIPT = "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏";
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

export function FontsSocialTool({ t }: FontsSocialToolProps) {
  const [text, setText] = useState("Hello World");

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
      />
      <div className="space-y-4">
        {FONTS.map((font) => (
          <div key={font.name} className="rounded-xl border border-[var(--border)] p-4">
            <div className="mb-2 text-sm text-[var(--muted)]">{font.name}</div>
            <div
              className="cursor-pointer select-all text-xl"
              onClick={() => navigator.clipboard.writeText(convert(text, font))}
            >
              {convert(text, font) || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
