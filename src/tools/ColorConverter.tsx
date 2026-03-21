'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import ColorPickerInput from '@/src/components/ColorPickerInput';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }
interface HSV { h: number; s: number; v: number }
interface CMYK { c: number; m: number; y: number; k: number }

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const c1 = 1 - r / 255, m1 = 1 - g / 255, y1 = 1 - b / 255;
  const k = Math.min(c1, m1, y1);
  return {
    c: Math.round(((c1 - k) / (1 - k)) * 100),
    m: Math.round(((m1 - k) / (1 - k)) * 100),
    y: Math.round(((y1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
  c /= 100; m /= 100; y /= 100; k /= 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k))
  };
}

export default function ColorConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const [hsv, setHsv] = useState<HSV>({ h: 217, s: 76, v: 96 });
  const [cmyk, setCmyk] = useState<CMYK>({ c: 76, m: 47, y: 0, k: 4 });
  const [copied, setCopied] = useState('');

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
    setHsv(rgbToHsv(r, g, b));
    setCmyk(rgbToCmyk(r, g, b));
  }, []);

  const handleHexChange = (value: string) => {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) updateFromRgb(parsed.r, parsed.g, parsed.b);
  };

  const handlePickerChange = (value: string) => {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) updateFromRgb(parsed.r, parsed.g, parsed.b);
  };

  const handleRgbChange = (channel: keyof RGB, value: string) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: num };
    updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
  };

  const handleHslChange = (channel: keyof HSL, value: string) => {
    const max = channel === 'h' ? 360 : 100;
    const num = Math.max(0, Math.min(max, parseInt(value) || 0));
    const newHsl = { ...hsl, [channel]: num };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    setCmyk(rgbToCmyk(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleCmykChange = (channel: keyof CMYK, value: string) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    const newCmyk = { ...cmyk, [channel]: num };
    setCmyk(newCmyk);
    const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyValue = async (label: string, value: string) => {
    try { await navigator.clipboard.writeText(value); } catch { return; }
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  // Initialize on mount
  useEffect(() => {
    updateFromRgb(59, 130, 246);
  }, [updateFromRgb]);

  const colorValues = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Color: 2 squares — picker + preview */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-end' }}>
          {/* Square 1: Color picker */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Pick color' : 'Выбор'}
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <ColorPickerInput value={hex} onChange={handlePickerChange} label={isEn ? 'Pick a color' : 'Выбор цвета'} />
            </Box>
          </Box>
          {/* Square 2: Preview */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Preview' : 'Просмотр'}
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 200,
                height: 80,
                borderRadius: 18,
                backgroundColor: hex,
                border: `2px solid ${theme.palette.divider}`,
                boxShadow: `0 4px 16px ${alpha(hex, 0.3)}`,
              }}
            />
          </Box>
        </Box>

        {/* HEX */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          HEX
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
          />
          <CopyButton text={hex} />
        </Box>

        {/* RGB */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          RGB
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField size="small" label="R" type="number" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 255 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="G" type="number" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 255 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="B" type="number" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 255 } }} sx={{ flex: 1 }} />
          <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        </Box>

        {/* HSL */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          HSL
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField size="small" label="H" type="number" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 360 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="S" type="number" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="L" type="number" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
        </Box>

        {/* HSV */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          HSV
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField size="small" label="H" type="number" value={hsv.h} slotProps={{ htmlInput: { min: 0, max: 360 }, input: { readOnly: true } }} sx={{ flex: 1 }} />
          <TextField size="small" label="S" type="number" value={hsv.s} slotProps={{ htmlInput: { min: 0, max: 100 }, input: { readOnly: true } }} sx={{ flex: 1 }} />
          <TextField size="small" label="V" type="number" value={hsv.v} slotProps={{ htmlInput: { min: 0, max: 100 }, input: { readOnly: true } }} sx={{ flex: 1 }} />
          <CopyButton text={hex} />
        </Box>

        {/* CMYK */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          CMYK
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField size="small" label="C" type="number" value={cmyk.c} onChange={(e) => handleCmykChange('c', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="M" type="number" value={cmyk.m} onChange={(e) => handleCmykChange('m', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="Y" type="number" value={cmyk.y} onChange={(e) => handleCmykChange('y', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <TextField size="small" label="K" type="number" value={cmyk.k} onChange={(e) => handleCmykChange('k', e.target.value)} slotProps={{ htmlInput: { min: 0, max: 100 } }} sx={{ flex: 1 }} />
          <CopyButton text={hex} />
        </Box>

        {/* Quick copy chips */}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {colorValues.map((cv) => (
            <Grid size={{ xs: 12, sm: 6 }} key={cv.label}>
              <Paper
                elevation={0}
                onClick={() => copyValue(cv.label, cv.value)}
                sx={{
                  p: 1.5,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.surfaceContainerLow
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {cv.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cv.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
