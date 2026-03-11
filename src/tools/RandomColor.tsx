'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme, IconButton
} from '@mui/material';
import { ContentCopy, Refresh, Palette, Delete } from '@mui/icons-material';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


type ColorMode = 'any' | 'pastel' | 'dark' | 'vibrant';

interface GeneratedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return { r: f(0), g: f(8), b: f(4) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

function generateRandomColor(mode: ColorMode): GeneratedColor {
  const h = Math.floor(Math.random() * 360);
  let s: number, l: number;

  switch (mode) {
    case 'pastel':
      s = 40 + Math.random() * 30;
      l = 70 + Math.random() * 20;
      break;
    case 'dark':
      s = 30 + Math.random() * 50;
      l = 10 + Math.random() * 25;
      break;
    case 'vibrant':
      s = 80 + Math.random() * 20;
      l = 40 + Math.random() * 20;
      break;
    default:
      s = Math.random() * 100;
      l = Math.random() * 100;
  }

  s = Math.round(s);
  l = Math.round(l);
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return { hex, rgb, hsl: { h, s, l } };
}

export default function RandomColor() {
  const theme = useTheme();
  const [mode, setMode] = useState<ColorMode>('any');
  const [current, setCurrent] = useState<GeneratedColor | null>(null);
  const [history, setHistory] = useState<GeneratedColor[]>([]);
  const [copied, setCopied] = useState<string>('');

  const generate = () => {
    const color = generateRandomColor(mode);
    setCurrent(color);
    setHistory(prev => [color, ...prev].slice(0, 20));
  };

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(''), 1500);
  };

  const modes: { key: ColorMode; label: string }[] = [
    { key: 'any', label: 'Любой' },
    { key: 'pastel', label: 'Пастельный' },
    { key: 'dark', label: 'Тёмный' },
    { key: 'vibrant', label: 'Яркий' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Тип цвета
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {modes.map((m) => (
              <Chip
                key={m.key}
                label={m.label}
                size="small"
                onClick={() => setMode(m.key)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: mode === m.key ? 600 : 400,
                  bgcolor: mode === m.key
                    ? theme.palette.surfaceContainerHigh
                    : theme.palette.surfaceContainerLow,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<Palette />}
            onClick={generate}
            sx={{ borderRadius: 5, py: 1.2, mb: 2 }}
          >
            Генерировать цвет
          </Button>

          {current && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: 140,
                  bgcolor: current.hex,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: getContrastColor(current.hex) }}
                >
                  {current.hex}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: theme.palette.surfaceContainerLow }}>
                {[
                  { label: 'HEX', value: current.hex },
                  { label: 'RGB', value: `rgb(${current.rgb.r}, ${current.rgb.g}, ${current.rgb.b})` },
                  { label: 'HSL', value: `hsl(${current.hsl.h}, ${current.hsl.s}%, ${current.hsl.l}%)` },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.75
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {item.value}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => copyValue(item.value)}
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {copied && (
                  <Typography variant="caption" color="primary" sx={{ mt: 0.5 }}>
                    Скопировано: {copied}
                  </Typography>
                )}
              </Box>
            </Paper>
          )}

          {!current && (
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}
            >
              <Palette sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите «Генерировать цвет» для создания случайного цвета
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            История ({history.length})
          </Typography>

          {history.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                История пока пуста
              </Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {history.map((color, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      width: 80,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                    onClick={() => copyValue(color.hex)}
                  >
                    <Box sx={{ height: 50, bgcolor: color.hex }} />
                    <Box sx={{ p: 0.5, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                        {color.hex}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Button
                size="small"
                startIcon={<Delete />}
                onClick={() => setHistory([])}
                sx={{ mt: 1.5, borderRadius: 4 }}
              >
                Очистить историю
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
