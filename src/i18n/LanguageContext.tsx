'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Locale,
  DEFAULT_LOCALE,
  loadMessages,
  getMsg,
  setLocaleToStorage,
  getLocaleFromPathname,
  localizedHref,
} from './index';

type Messages = Record<string, unknown>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  ready: boolean;
  /** Build a locale-prefixed href */
  lHref: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  ready: false,
  lHref: (path) => path,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive locale from URL path
  const urlLocale = getLocaleFromPathname(pathname);
  const [locale, setLocaleState] = useState<Locale>(urlLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [ready, setReady] = useState(false);

  // Sync locale when URL changes
  useEffect(() => {
    setLocaleState(urlLocale);
    setLocaleToStorage(urlLocale);
    loadMessages(urlLocale).then((msgs) => {
      setMessages(msgs);
      setReady(true);
    });
  }, [urlLocale]);

  // Update html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleToStorage(newLocale);
    // Navigate to the same page with new locale prefix
    const newPath = localizedHref(pathname, newLocale);
    router.push(newPath);
  }, [pathname, router]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => getMsg(messages, key, vars),
    [messages],
  );

  const lHref = useCallback(
    (path: string) => localizedHref(path, locale),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready, lHref }),
    [locale, setLocale, t, ready, lHref],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
