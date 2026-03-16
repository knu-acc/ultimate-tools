'use client';

import { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, IconButton, useTheme, alpha
} from '@mui/material';
import { Refresh, Lock, LockOpen } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

function generatePalette(count: number = 5): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];
  const schemes = ['analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic'];
  const scheme = schemes[Math.floor(Math.random() * schemes.length)];

  switch (scheme) {
    case 'analogous':
      for (let i = 0; i < count; i++) {
        const hue = (baseHue + i * 30) % 360;
        colors.push(hslToHex(hue, 60 + Math.random() * 25, 45 + Math.random() * 20));
      }
      break;
    case 'complementary':
      for (let i = 0; i < count; i++) {
        const hue = i < count / 2 ? baseHue : (baseHue + 180) % 360;
        const lightness = 35 + (i * 12);
        colors.push(hslToHex(hue + (Math.random() * 10 - 5), 60 + Math.random() * 25, lightness));
      }
      break;
    case 'triadic':
      for (let i = 0; i < count; i++) {
        const hue = (baseHue + (i % 3) * 120 + Math.floor(i / 3) * 15) % 360;
        colors.push(hslToHex(hue, 55 + Math.random() * 30, 40 + Math.random() * 25));
      }
      break;
    default:
      for (let i = 0; i < count; i++) {
        const lightness = 25 + i * (50 / count);
        colors.push(hslToHex(baseHue, 50 + Math.random() * 35, lightness));
      }
  }
  return colors;
}

export default function ColorPalette() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [colors, setColors] = useState<string[]>(generatePalette(5));
  const [locked, setLocked] = useState<boolean[]>(Array(5).fill(false));
  const regenerate = useCallback(() => {
    const newColors = generatePalette(5);
    setColors(prev => prev.map((c, i) => locked[i] ? c : newColors[i]));
  }, [locked]);

  const toggleLock = (index: number) => {
    setLocked(prev => prev.map((v, i) => i === index ? !v : v));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Main palette */}
      <Box
        sx={{
          display: 'flex',
          borderRadius: 3,
          overflow: 'hidden',
          height: { xs: 200, md: 280 },
          mb: 2
        }}
      >
        {colors.map((color, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              bgcolor: color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'flex 0.3s ease',
              '&:hover': { flex: 1.3 },
              position: 'relative'
            }}
          >
            <Typography
              sx={{
                color: getContrastColor(color),
                fontWeight: 700,
                fontSize: { xs: '0.7rem', md: '0.9rem' },
                mb: 0.5
              }}
            >
              {color}
            </Typography>
            <CopyButton text={color} size="small" />
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
              sx={{ color: getContrastColor(color), opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              {locked[i] ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={regenerate}
          sx={{ borderRadius: 3, px: 4, textTransform: 'none', fontWeight: 600 }}
        >
          {isEn ? 'Generate (Space)' : 'Генерировать (Пробел)'}
        </Button>
        <CopyButton text={colors.join(', ')} />
      </Box>

      {/* Color details */}
      <Grid container spacing={1.5}>
        {colors.map((color, i) => {
          const rgb = hexToRgb(color);
          return (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: theme.palette.surfaceContainerLow,
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: color,
                    mb: 1.5
                  }}
                />
                <Typography variant="body2" fontWeight={600}>{color}</Typography>
                <Typography variant="caption" color="text.secondary">
                  RGB({rgb.r}, {rgb.g}, {rgb.b})
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* CSS export */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {isEn ? 'CSS Variables' : 'CSS переменные'}
        </Typography>
        <Box
          component="pre"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            m: 0,
            whiteSpace: 'pre-wrap',
            color: theme.palette.text.secondary
          }}
        >
          {`:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`}
        </Box>
        <Box sx={{ mt: 1 }}>
          <CopyButton text={`:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`} />
        </Box>
      </Paper>
    </Box>
  );
}
