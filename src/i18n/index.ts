/**
 * i18n — lightweight client-side language system
 * No URL changes — language stored in localStorage and cookie
 * Drop-in replacement once all strings are extracted
 */

export type Locale = 'ru' | 'en';

export const LOCALES: Locale[] = ['ru', 'en'];
export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'РУ',
  en: 'EN',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

type Messages = Record<string, unknown>;

let cachedMessages: Partial<Record<Locale, Messages>> = {};

export async function loadMessages(locale: Locale): Promise<Messages> {
  if (cachedMessages[locale]) return cachedMessages[locale]!;
  try {
    const mod = await import(`../../messages/${locale}.json`);
    cachedMessages[locale] = mod.default as Messages;
    return cachedMessages[locale]!;
  } catch {
    // fallback to ru
    const mod = await import('../../messages/ru.json');
    cachedMessages[locale] = mod.default as Messages;
    return cachedMessages[locale]!;
  }
}

/** Get nested value from messages object by dot-notation key */
export function getMsg(messages: Messages, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split('.');
  let current: unknown = messages;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key; // fallback to key
    }
  }
  if (typeof current !== 'string') return key;
  if (!vars) return current;
  return current.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function getLocaleFromStorage(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem('locale') as Locale | null;
  return stored && LOCALES.includes(stored) ? stored : DEFAULT_LOCALE;
}

export function setLocaleToStorage(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  // Also set cookie for SSR
  document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
}
