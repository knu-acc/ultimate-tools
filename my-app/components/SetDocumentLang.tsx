"use client";

import { useEffect } from "react";

interface SetDocumentLangProps {
  lang: string;
}

/**
 * Sets the correct `lang` attribute on <html> for screen readers and SEO.
 * Runs client-side because Next.js App Router only allows <html> in root layout.
 */
export function SetDocumentLang({ lang }: SetDocumentLangProps) {
  useEffect(() => {
    const bcp47 = lang === "kz" ? "kk" : lang;
    document.documentElement.lang = bcp47;
    document.documentElement.setAttribute("dir", "ltr");
  }, [lang]);

  return null;
}
