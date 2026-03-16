'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
  useRef,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Locale,
  LOCALES,
  DEFAULT_LOCALE,
  loadMessages,
  seedMessages,
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

interface LanguageProviderProps {
  children: ReactNode;
  /** Pre-loaded messages from server component — eliminates translation flash */
  initialMessages?: Messages;
  /** Locale resolved on the server from URL params */
  initialLocale?: Locale;
  /** All locale messages map for instant locale switching (no async load) */
  allMessages?: Partial<Record<string, Messages>>;
}

export function LanguageProvider({ children, initialMessages, initialLocale, allMessages }: LanguageProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive locale from URL path
  const urlLocale = getLocaleFromPathname(pathname);
  const effectiveLocale = initialLocale || urlLocale;

  // Pre-seed the message cache with ALL provided messages
  // This makes loadMessages() return synchronously for any locale
  const seeded = useRef(false);
  if (!seeded.current) {
    if (allMessages) {
      for (const loc of LOCALES) {
        if (allMessages[loc]) seedMessages(loc, allMessages[loc]);
      }
    } else if (initialMessages && initialLocale) {
      seedMessages(initialLocale, initialMessages);
    }
    seeded.current = true;
  }

  // When initialMessages are provided (from SSR), start ready immediately — no flash
  const [locale, setLocaleState] = useState<Locale>(effectiveLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages || {});
  const [ready, setReady] = useState(!!initialMessages);

  // Sync locale when URL changes (handles client-side navigation)
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
