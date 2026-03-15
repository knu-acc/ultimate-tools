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
import {
  Locale,
  DEFAULT_LOCALE,
  loadMessages,
  getMsg,
  getLocaleFromStorage,
  setLocaleToStorage,
} from './index';

type Messages = Record<string, unknown>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  ready: false,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getLocaleFromStorage();
    setLocaleState(stored);
    loadMessages(stored).then((msgs) => {
      setMessages(msgs);
      setReady(true);
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleToStorage(newLocale);
    loadMessages(newLocale).then((msgs) => {
      setMessages(msgs);
    });
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => getMsg(messages, key, vars),
    [messages],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
