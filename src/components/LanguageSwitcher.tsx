'use client';

import React from 'react';
import { Button, alpha, useTheme } from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { LOCALES, LOCALE_LABELS, Locale } from '@/src/i18n/index';

export default function LanguageSwitcher() {
  const theme = useTheme();
  const { locale, setLocale } = useLanguage();

  const next: Locale = locale === 'ru' ? 'en' : 'ru';

  return (
    <Button
      onClick={() => setLocale(next)}
      size="small"
      sx={{
        minWidth: 40,
        height: 36,
        px: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        fontSize: '0.8125rem',
        letterSpacing: '0.05em',
        color: theme.palette.text.secondary,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        },
        transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {LOCALE_LABELS[next]}
    </Button>
  );
}
