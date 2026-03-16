'use client';

import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  setMode: () => {},
  resolvedMode: 'light',
});

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  /**
   * Strategy to eliminate BOTH theme flash AND hydration mismatch:
   *
   * 1. The inline <script> in layout.tsx sets data-theme, CSS custom properties
   *    (--ut-bg, --ut-text), and color-scheme on <html> BEFORE React hydrates.
   *    This gives the correct background/text color instantly via CSS.
   *
   * 2. For the React hydration pass, we ALWAYS start with lightTheme (matching SSR).
   *    This avoids hydration mismatch since server also renders lightTheme.
   *
   * 3. On mount (useEffect), we read the actual preference and switch themes.
   *    The switch from light→dark MUI theme is invisible because the CSS custom
   *    properties already provide the correct colors — the user sees no flash.
   */
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Read stored preference
    const stored = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (stored) setModeState(stored);

    // Detect system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
    // Update data-theme + CSS custom properties immediately
    const isDark = newMode === 'dark' || (newMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const d = document.documentElement;
    d.setAttribute('data-theme', isDark ? 'dark' : 'light');
    d.style.setProperty('--ut-bg', isDark ? '#141218' : '#FEF7FF');
    d.style.setProperty('--ut-text', isDark ? '#E6E0E9' : '#1D1B20');
    d.style.colorScheme = isDark ? 'dark' : 'light';
  };

  const resolvedMode = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const theme = useMemo(() => (resolvedMode === 'dark' ? darkTheme : lightTheme), [resolvedMode]);

  // Update data-theme when resolved mode changes (after mount)
  useEffect(() => {
    if (!mounted) return;
    const d = document.documentElement;
    d.setAttribute('data-theme', resolvedMode);
    d.style.setProperty('--ut-bg', resolvedMode === 'dark' ? '#141218' : '#FEF7FF');
    d.style.setProperty('--ut-text', resolvedMode === 'dark' ? '#E6E0E9' : '#1D1B20');
    d.style.colorScheme = resolvedMode;
  }, [resolvedMode, mounted]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedMode }}>
      {/* Before mount: lightTheme (matches SSR, no hydration mismatch).
          CSS custom properties from inline script prevent any visible flash.
          After mount: correct theme based on user preference. */}
      <ThemeProvider theme={mounted ? theme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
