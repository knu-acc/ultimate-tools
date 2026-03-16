'use client';

import { useTheme } from '@mui/material/styles';

/**
 * MD3 shape tokens from theme for consistent borderRadius and spacing.
 * Use in tool components instead of hardcoded numbers.
 */
export function useMd3Shape() {
  const theme = useTheme();
  const s = theme.shape as { extraSmall?: number; small?: number; medium?: number; large?: number; extraLarge?: number; full?: number } | undefined;
  return {
    input: s?.extraSmall ?? 4,
    small: s?.small ?? 8,
    card: s?.medium ?? 12,
    medium: s?.medium ?? 12,
    large: s?.large ?? 16,
    extraLarge: s?.extraLarge ?? 28,
    full: s?.full ?? 9999,
  };
}
