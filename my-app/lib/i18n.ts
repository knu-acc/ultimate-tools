import type { Lang } from "./tools-registry";

const translations: Record<Lang, Record<string, unknown>> = {
  ru: {},
  kz: {},
  en: {},
};

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const ov = override[key];
    const baseVal = result[key];
    if (ov && typeof ov === "object" && !Array.isArray(ov) &&
        baseVal && typeof baseVal === "object" && !Array.isArray(baseVal)) {
      result[key] = deepMerge(baseVal as Record<string, unknown>, ov as Record<string, unknown>);
    } else {
      result[key] = ov;
    }
  }
  return result;
}

export async function loadTranslations(lang: Lang) {
  if (Object.keys(translations[lang]).length > 0) return translations[lang];
  const ruMod = await import("@/locales/ru.json");
  const ruData = ruMod.default as Record<string, unknown>;
  if (lang === "ru") {
    translations[lang] = ruData;
  } else {
    const mod = await import(`@/locales/${lang}.json`);
    const data = mod.default as Record<string, unknown>;
    translations[lang] = deepMerge(ruData, data);
  }
  return translations[lang];
}

export function flattenTranslations(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenTranslations(value as Record<string, unknown>, path));
    } else if (typeof value === "string") {
      result[path] = value;
    }
  }
  return result;
}

export function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "kz", label: "KZ" },
  { code: "en", label: "EN" },
];
