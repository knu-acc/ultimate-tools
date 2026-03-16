'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, TextField, useTheme, alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#000000' : '#FFFFFF';
}

function drawColorWheel(canvas: HTMLCanvasElement, size: number) {
  if (typeof document === 'undefined') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  for (let angle = 0; angle < 360; angle += 0.5) {
    const startAngle = (angle - 1) * Math.PI / 180;
    const endAngle = (angle + 1) * Math.PI / 180;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `hsl(${angle}, 0%, 100%)`);
    gradient.addColorStop(0.5, `hsl(${angle}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${angle}, 100%, 0%)`);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function getColorFromPosition(x: number, y: number, size: number): [number, number, number] | null {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > radius) return null;

  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle < 0) angle += 360;

  const saturation = dist / radius;
  const h = angle;
  const s = saturation * 100;
  const l = 50 - (saturation * 50 - 50) * 0;
  // Approximate: at center white, at edge full saturation
  const lightness = 100 - (dist / radius) * 50;

  return [Math.round(h), Math.round(s), Math.round(lightness)];
}

export default function ColorWheel() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedHsl, setSelectedHsl] = useState<[number, number, number]>([0, 100, 50]);
  const wheelSize = 280;

  const [h, s, l] = selectedHsl;
  const [r, g, b] = hslToRgb(h, s, l);
  const hex = rgbToHex(r, g, b);

  const complementary = rgbToHex(...hslToRgb((h + 180) % 360, s, l));
  const triadic1 = rgbToHex(...hslToRgb((h + 120) % 360, s, l));
  const triadic2 = rgbToHex(...hslToRgb((h + 240) % 360, s, l));
  const analogous1 = rgbToHex(...hslToRgb((h + 30) % 360, s, l));
  const analogous2 = rgbToHex(...hslToRgb((h - 30 + 360) % 360, s, l));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const canvas = canvasRef.current;
    if (canvas) {
      drawColorWheel(canvas, wheelSize);
    }
  }, [wheelSize]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (typeof document === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = wheelSize / rect.width;
    const scaleY = wheelSize / rect.height;

    const cx = wheelSize / 2;
    const cy = wheelSize / 2;
    const radius = wheelSize / 2 - 4;
    const dx = x * scaleX - cx;
    const dy = y * scaleY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= radius) {
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      const sat = Math.min((dist / radius) * 100, 100);
      const light = 50;
      setSelectedHsl([Math.round(angle), Math.round(sat), light]);
    }
  }, [wheelSize]);

  const colorSchemes = [
    { label: isEn ? 'Complementary' : 'Комплементарный', colors: [hex, complementary] },
    { label: isEn ? 'Triadic' : 'Триадный', colors: [hex, triadic1, triadic2] },
    { label: isEn ? 'Analogous' : 'Аналоговый', colors: [analogous1, hex, analogous2] },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Color Wheel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ position: 'relative', width: wheelSize, height: wheelSize, cursor: 'crosshair' }}>
              <canvas
                ref={canvasRef}
                width={wheelSize}
                height={wheelSize}
                onClick={handleCanvasClick}
                style={{ borderRadius: '50%', width: '100%', height: '100%' }}
              />
              {/* Selection indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                  bgcolor: hex,
                  transform: `translate(${
                    Math.cos(h * Math.PI / 180) * (s / 100) * (wheelSize / 2 - 4) - 8
                  }px, ${
                    Math.sin(h * Math.PI / 180) * (s / 100) * (wheelSize / 2 - 4) - 8
                  }px)`,
                  pointerEvents: 'none'
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {isEn ? 'Click the wheel to pick a color' : 'Нажмите на колесо для выбора цвета'}
            </Typography>
          </Paper>
        </Grid>

        {/* Selected Color Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              mb: 2,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 80,
                borderRadius: 2,
                bgcolor: hex,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography sx={{ color: getContrastColor(hex), fontWeight: 700, fontSize: '1.2rem' }}>
                {hex}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'HEX', value: hex },
                { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
                { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={label} size="small" sx={{ minWidth: 48, fontWeight: 600 }} />
                  <TextField
                    size="small"
                    value={value}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
                  />
                  <CopyButton text={value} />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* HSL Sliders */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: isEn ? 'Hue (H)' : 'Оттенок (H)', val: h, max: 360, idx: 0 as const },
                { label: isEn ? 'Saturation (S)' : 'Насыщенность (S)', val: s, max: 100, idx: 1 as const },
                { label: isEn ? 'Lightness (L)' : 'Яркость (L)', val: l, max: 100, idx: 2 as const },
              ].map(({ label, val, max, idx }) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}: {val}
                  </Typography>
                  <input
                    type="range"
                    min={0}
                    max={max}
                    value={val}
                    onChange={(e) => {
                      const newHsl: [number, number, number] = [...selectedHsl];
                      newHsl[idx] = Number(e.target.value);
                      setSelectedHsl(newHsl);
                    }}
                    style={{ width: '100%', accentColor: theme.palette.primary.main }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Color Harmonies */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 3, mb: 1.5 }}>
        {isEn ? 'Color Harmonies' : 'Цветовые гармонии'}
      </Typography>
      <Grid container spacing={2}>
        {colorSchemes.map(({ label, colors }) => (
          <Grid key={label} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow,
                transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
              }}
            >
              <Typography variant="body2" fontWeight={600} gutterBottom>
                {label}
              </Typography>
              <Box sx={{ display: 'flex', borderRadius: 1.5, overflow: 'hidden', height: 48, mb: 1 }}>
                {colors.map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      bgcolor: c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.85 }
                    }}
                  >
                    <Typography sx={{ color: getContrastColor(c), fontSize: '0.65rem', fontWeight: 600 }}>
                      {c}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                {colors.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Chip
                      label={c}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem'
                      }}
                    />
                    <CopyButton text={c} size="small" />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
