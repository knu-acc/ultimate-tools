'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Chip, alpha, useTheme
} from '@mui/material';
import ColorPickerInput from '@/src/components/ColorPickerInput';

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio: number, isLargeText: boolean): { aa: boolean; aaa: boolean } {
  if (isLargeText) {
    return { aa: ratio >= 3, aaa: ratio >= 4.5 };
  }
  return { aa: ratio >= 4.5, aaa: ratio >= 7 };
}

export default function ContrastChecker() {
  const theme = useTheme();
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const ratio = contrastRatio(fgColor, bgColor);
  const normalText = getWCAGLevel(ratio, false);
  const largeText = getWCAGLevel(ratio, true);

  const ratingLabel = ratio >= 7 ? 'Отлично' : ratio >= 4.5 ? 'Хорошо' : ratio >= 3 ? 'Удовлетворительно' : 'Плохо';
  const ratingColor = ratio >= 7 ? theme.palette.success.main : ratio >= 4.5 ? '#4CAF50' : ratio >= 3 ? theme.palette.warning.main : theme.palette.error.main;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorPickerInput value={fgColor} onChange={setFgColor} label="Цвет текста" />
                <TextField size="small" value={fgColor} onChange={(e) => setFgColor(e.target.value)} placeholder="Цвет текста" sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }} />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorPickerInput value={bgColor} onChange={setBgColor} label="Цвет фона" />
                <TextField size="small" value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="Цвет фона" sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }} />
              </Box>
            </Grid>
          </Grid>

          {/* Contrast Ratio */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: alpha(ratingColor, 0.08), textAlign: 'center', mb: 2 }}>
            <Typography variant="h2" fontWeight={700} sx={{ color: ratingColor }}>
              {ratio.toFixed(2)}:1
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: ratingColor }}>
              {ratingLabel}
            </Typography>
          </Paper>

          {/* WCAG results */}
          <Grid container spacing={1}>
            <Grid size={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: normalText.aa ? alpha('#4CAF50', 0.08) : alpha('#f44336', 0.08) }}>
                <Typography variant="body2" fontWeight={600}>AA Обычный</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: normalText.aa ? '#4CAF50' : '#f44336' }}>
                  {normalText.aa ? '✓ Пройден' : '✗ Не пройден'}
                </Typography>
                <Typography variant="caption" color="text.secondary">≥ 4.5:1</Typography>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: normalText.aaa ? alpha('#4CAF50', 0.08) : alpha('#f44336', 0.08) }}>
                <Typography variant="body2" fontWeight={600}>AAA Обычный</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: normalText.aaa ? '#4CAF50' : '#f44336' }}>
                  {normalText.aaa ? '✓ Пройден' : '✗ Не пройден'}
                </Typography>
                <Typography variant="caption" color="text.secondary">≥ 7:1</Typography>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: largeText.aa ? alpha('#4CAF50', 0.08) : alpha('#f44336', 0.08) }}>
                <Typography variant="body2" fontWeight={600}>AA Крупный</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: largeText.aa ? '#4CAF50' : '#f44336' }}>
                  {largeText.aa ? '✓ Пройден' : '✗ Не пройден'}
                </Typography>
                <Typography variant="caption" color="text.secondary">≥ 3:1</Typography>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: largeText.aaa ? alpha('#4CAF50', 0.08) : alpha('#f44336', 0.08) }}>
                <Typography variant="body2" fontWeight={600}>AAA Крупный</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: largeText.aaa ? '#4CAF50' : '#f44336' }}>
                  {largeText.aaa ? '✓ Пройден' : '✗ Не пройден'}
                </Typography>
                <Typography variant="caption" color="text.secondary">≥ 4.5:1</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {/* Preview */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: bgColor, mb: 2 }}>
            <Typography variant="h4" sx={{ color: fgColor, fontWeight: 700, mb: 1 }}>
              Заголовок страницы
            </Typography>
            <Typography variant="body1" sx={{ color: fgColor, mb: 2 }}>
              Это пример обычного текста на выбранном фоне. Проверьте, насколько хорошо читается содержимое.
            </Typography>
            <Typography variant="body2" sx={{ color: fgColor, opacity: 0.8 }}>
              Мелкий текст тоже должен быть читабельным для обеспечения доступности.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: fgColor }}>
            <Typography variant="h4" sx={{ color: bgColor, fontWeight: 700, mb: 1 }}>
              Инвертированный вариант
            </Typography>
            <Typography variant="body1" sx={{ color: bgColor }}>
              Тот же контраст в обратном порядке — текст и фон поменялись местами.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
