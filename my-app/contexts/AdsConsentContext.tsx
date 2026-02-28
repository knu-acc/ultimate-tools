"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

const STORAGE_KEY = "ultimate-tools-ads-consent";

type ConsentState = boolean | null; // null = not set, true = accepted, false = declined

type AdsConsentContextValue = {
  consent: ConsentState;
  accept: () => void;
  decline: () => void;
};

const AdsConsentContext = createContext<AdsConsentContextValue | null>(null);

function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "0" || v === "false") return false;
  } catch {}
  return true;
}

export function AdsConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setConsent(true);
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "0");
    } catch {}
    setConsent(false);
  }, []);

  return (
    <AdsConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
    </AdsConsentContext.Provider>
  );
}

export function useAdsConsent() {
  const ctx = useContext(AdsConsentContext);
  return ctx ?? { consent: null, accept: () => {}, decline: () => {} };
}
