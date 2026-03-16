'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import ColorPickerInput from '@/src/components/ColorPickerInput';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
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

function blendRGB(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t)
  };
}

function blendHSL(c1: RGB, c2: RGB, t: number): RGB {
  const hsl1 = rgbToHsl(c1.r, c1.g, c1.b);
  const hsl2 = rgbToHsl(c2.r, c2.g, c2.b);

  let hDiff = hsl2.h - hsl1.h;
  if (hDiff > 180) hDiff -= 360;
  if (hDiff < -180) hDiff += 360;

  const h = ((hsl1.h + hDiff * t) % 360 + 360) % 360;
  const s = hsl1.s + (hsl2.s - hsl1.s) * t;
  const l = hsl1.l + (hsl2.l - hsl1.l) * t;

  return hslToRgb(h, s, l);
}

export default function ColorBlender() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ef4444');
  const [steps, setSteps] = useState(5);
  const [mode, setMode] = useState<'rgb' | 'hsl'>('rgb');
  const getBlendedColors = useCallback((): string[] => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return [];

    const result: string[] = [color1.toUpperCase()];
    for (let i = 1; i <= steps; i++) {
      const t = i / (steps + 1);
      const blended = mode === 'rgb' ? blendRGB(c1, c2, t) : blendHSL(c1, c2, t);
      result.push(rgbToHex(blended.r, blended.g, blended.b).toUpperCase());
    }
    result.push(color2.toUpperCase());
    return result;
  }, [color1, color2, steps, mode]);

  const blendedColors = getBlendedColors();

  const gradientCSS = `background: linear-gradient(to right, ${blendedColors.join(', ')});`;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Grid container spacing={3}>
          {/* Color A */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  backgroundColor: color1,
                  border: `2px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  boxShadow: `0 2px 8px ${alpha(color1, 0.4)}`
                }}
              />
              <ColorPickerInput value={color1} onChange={setColor1} />
              <TextField
                size="small"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                sx={{ flex: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
              />
            </Box>
          </Grid>

          {/* Color B */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  backgroundColor: color2,
                  border: `2px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  boxShadow: `0 2px 8px ${alpha(color2, 0.4)}`
                }}
              />
              <ColorPickerInput value={color2} onChange={setColor2} />
              <TextField
                size="small"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                sx={{ flex: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Steps slider */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {isEn ? `Intermediate steps: ${steps}` : `Промежуточные шаги: ${steps}`}
          </Typography>
          <Slider
            value={steps}
            onChange={(_, v) => setSteps(v as number)}
            min={2}
            max={20}
            marks={[
              { value: 2, label: '2' },
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 15, label: '15' },
              { value: 20, label: '20' },
            ]}
          />
        </Box>

        {/* Blend mode */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {isEn ? 'Blend mode' : 'Режим смешивания'}
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
            size="small"
          >
            <ToggleButton value="rgb" sx={{ px: 3 }}>
              {isEn ? 'RGB Linear' : 'RGB линейный'}
            </ToggleButton>
            <ToggleButton value="hsl" sx={{ px: 3 }}>
              HSL
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Result strip */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {isEn ? `Result (${blendedColors.length} colors)` : `Результат (${blendedColors.length} цветов)`}
        </Typography>

        {/* Gradient preview */}
        <Box
          sx={{
            width: '100%',
            height: 60,
            borderRadius: 10,
            background: `linear-gradient(to right, ${blendedColors.join(', ')})`,
            mb: 2
          }}
        />

        {/* Individual color boxes */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          {blendedColors.map((color, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 auto',
                minWidth: 50,
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  height: 48,
                  backgroundColor: color,
                  borderRadius: 1.5,
                  mb: 0.5
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.65rem',
                    color: 'text.secondary'
                  }}
                >
                  {color}
                </Typography>
              </Box>
              <CopyButton text={color} size="small" />
            </Box>
          ))}
        </Box>

        {/* CSS Gradient code */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {isEn ? 'CSS Gradient' : 'CSS градиент'}
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 10,
            bgcolor: theme.palette.surfaceContainerLow,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1
          }}
        >
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              flex: 1
            }}
          >
            {gradientCSS}
          </Typography>
          <CopyButton text={gradientCSS} />
        </Paper>

        {/* Copy all HEX values */}
        <Box sx={{ mt: 1.5 }}>
          <CopyButton text={blendedColors.join(', ')} />
        </Box>
      </Paper>
    </Box>
  );
}
