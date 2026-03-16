'use client';

import React from 'react';
import { Box, ButtonBase, alpha, useTheme } from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { Locale } from '@/src/i18n/index';

export default function LanguageSwitcher() {
  const theme = useTheme();
  const { locale, setLocale } = useLanguage();

  const options: { value: Locale; label: string }[] = [
    { value: 'ru', label: 'РУ' },
    { value: 'en', label: 'EN' },
  ];

  const motionDuration = theme.md3?.motion.duration.short4 ?? '200ms';
  const motionEasing = theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)';

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: `${theme.shape?.full ?? 9999}px`,
        border: `1px solid ${theme.palette.outline ?? alpha(theme.palette.text.primary, 0.2)}`,
        overflow: 'hidden',
      }}
    >
      {options.map((opt) => {
        const isActive = locale === opt.value;
        return (
          <ButtonBase
            key={opt.value}
            onClick={() => setLocale(opt.value)}
            aria-pressed={isActive}
            aria-label={`Switch to ${opt.label}`}
            sx={{
              px: 2,
              py: 0.75,
              minWidth: 44,
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
              transition: `background-color ${motionDuration} ${motionEasing}, color ${motionDuration} ${motionEasing}`,
              '&:hover': {
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, 0.16)
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {opt.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
