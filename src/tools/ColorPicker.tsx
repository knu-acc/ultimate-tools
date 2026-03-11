'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Slider,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CopyButton } from '@/src/components/CopyButton';


interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('').toUpperCase();
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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

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

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

function getComplementary(h: number): number {
  return (h + 180) % 360;
}

function getAnalogous(h: number): [number, number] {
  return [(h + 30) % 360, (h - 30 + 360) % 360];
}

export default function ColorPicker() {
  const theme = useTheme();
  const [hex, setHex] = useState('#4A90D9');
  const [rgb, setRgb] = useState<RGB>({ r: 74, g: 144, b: 217 });
  const [hsl, setHsl] = useState<HSL>({ h: 211, s: 66, l: 57 });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const svCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingSV = useRef(false);
  const isDraggingHue = useRef(false);

  const copyText = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const addToRecent = useCallback((hexColor: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== hexColor);
      return [hexColor, ...filtered].slice(0, 10);
    });
  }, []);

  const updateFromRgb = useCallback(
    (r: number, g: number, b: number, saveRecent = true) => {
      const newRgb = { r, g, b };
      const newHex = rgbToHex(r, g, b);
      const newHsl = rgbToHsl(r, g, b);
      setRgb(newRgb);
      setHex(newHex);
      setHsl(newHsl);
      if (saveRecent) addToRecent(newHex);
    },
    [addToRecent]
  );

  const updateFromHsl = useCallback(
    (h: number, s: number, l: number, saveRecent = true) => {
      const newHsl = { h, s, l };
      const newRgb = hslToRgb(h, s, l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setHsl(newHsl);
      setRgb(newRgb);
      setHex(newHex);
      if (saveRecent) addToRecent(newHex);
    },
    [addToRecent]
  );

  const updateFromHex = useCallback(
    (value: string) => {
      setHex(value);
      const clean = value.replace('#', '');
      if (clean.length === 6 && /^[0-9a-fA-F]{6}$/.test(clean)) {
        const newRgb = hexToRgb(value);
        const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
        setRgb(newRgb);
        setHsl(newHsl);
        addToRecent('#' + clean.toUpperCase());
      }
    },
    [addToRecent]
  );

  // Draw SV canvas
  const drawSVCanvas = useCallback(() => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Hue base color
    const hueRgb = hslToRgb(hsl.h, 100, 50);
    ctx.fillStyle = `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`;
    ctx.fillRect(0, 0, w, h);

    // White gradient (left to right)
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, h);

    // Black gradient (top to bottom)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, h);

    // Indicator
    // Convert current color to SV position
    const rr = rgb.r / 255, gg = rgb.g / 255, bb = rgb.b / 255;
    const maxC = Math.max(rr, gg, bb);
    const minC = Math.min(rr, gg, bb);
    const v = maxC;
    const s = maxC === 0 ? 0 : (maxC - minC) / maxC;

    const ix = s * w;
    const iy = (1 - v) * h;

    ctx.beginPath();
    ctx.arc(ix, iy, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ix, iy, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hsl.h, rgb]);

  // Draw hue bar
  const drawHueBar = useCallback(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    for (let i = 0; i <= 6; i++) {
      const hueColors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'];
      grad.addColorStop(i / 6, hueColors[i]);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Indicator
    const iy = (hsl.h / 360) * h;
    ctx.beginPath();
    ctx.moveTo(0, iy);
    ctx.lineTo(w, iy);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hsl.h]);

  useEffect(() => {
    drawSVCanvas();
    drawHueBar();
  }, [drawSVCanvas, drawHueBar]);

  const handleSVInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = svCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      // s = x, v = 1 - y
      const s = x;
      const v = 1 - y;

      // HSV to RGB
      const c = v * s;
      const hh = hsl.h / 60;
      const xx = c * (1 - Math.abs((hh % 2) - 1));
      const m = v - c;
      let rr = 0, gg = 0, bb = 0;
      if (hh >= 0 && hh < 1) { rr = c; gg = xx; }
      else if (hh >= 1 && hh < 2) { rr = xx; gg = c; }
      else if (hh >= 2 && hh < 3) { gg = c; bb = xx; }
      else if (hh >= 3 && hh < 4) { gg = xx; bb = c; }
      else if (hh >= 4 && hh < 5) { rr = xx; bb = c; }
      else { rr = c; bb = xx; }

      updateFromRgb(
        Math.round((rr + m) * 255),
        Math.round((gg + m) * 255),
        Math.round((bb + m) * 255),
        false
      );
    },
    [hsl.h, updateFromRgb]
  );

  const handleHueInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = hueCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newHue = Math.round(y * 360) % 360;

      // Keep current SV, just change hue
      const rr = rgb.r / 255, gg = rgb.g / 255, bb = rgb.b / 255;
      const maxC = Math.max(rr, gg, bb);
      const minC = Math.min(rr, gg, bb);
      const v = maxC;
      const s = maxC === 0 ? 0 : (maxC - minC) / maxC;

      // HSV to RGB with new hue
      const c = v * s;
      const hh = newHue / 60;
      const xx = c * (1 - Math.abs((hh % 2) - 1));
      const m = v - c;
      let r2 = 0, g2 = 0, b2 = 0;
      if (hh >= 0 && hh < 1) { r2 = c; g2 = xx; }
      else if (hh >= 1 && hh < 2) { r2 = xx; g2 = c; }
      else if (hh >= 2 && hh < 3) { g2 = c; b2 = xx; }
      else if (hh >= 3 && hh < 4) { g2 = xx; b2 = c; }
      else if (hh >= 4 && hh < 5) { r2 = xx; b2 = c; }
      else { r2 = c; b2 = xx; }

      updateFromRgb(
        Math.round((r2 + m) * 255),
        Math.round((g2 + m) * 255),
        Math.round((b2 + m) * 255),
        false
      );
    },
    [rgb, updateFromRgb]
  );

  const handleSVMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDraggingSV.current = true;
      handleSVInteraction(e);
    },
    [handleSVInteraction]
  );

  const handleSVMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingSV.current) return;
      handleSVInteraction(e);
    },
    [handleSVInteraction]
  );

  const handleHueMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDraggingHue.current = true;
      handleHueInteraction(e);
    },
    [handleHueInteraction]
  );

  const handleHueMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingHue.current) return;
      handleHueInteraction(e);
    },
    [handleHueInteraction]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingSV.current || isDraggingHue.current) {
      addToRecent(hex);
    }
    isDraggingSV.current = false;
    isDraggingHue.current = false;
  }, [hex, addToRecent]);

  useEffect(() => {
    const handler = () => {
      isDraggingSV.current = false;
      isDraggingHue.current = false;
    };
    window.addEventListener('mouseup', handler);
    return () => window.removeEventListener('mouseup', handler);
  }, []);

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const compHue = getComplementary(hsl.h);
  const [anaHue1, anaHue2] = getAnalogous(hsl.h);
  const compRgb = hslToRgb(compHue, hsl.s, hsl.l);
  const ana1Rgb = hslToRgb(anaHue1, hsl.s, hsl.l);
  const ana2Rgb = hslToRgb(anaHue2, hsl.s, hsl.l);

  const formats = [
    { label: 'HEX', value: hex, key: 'hex' },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: 'rgb' },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: 'hsl' },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, key: 'cmyk' },
  ];

  const relatedColors = [
    { label: 'Комплементарный', hex: rgbToHex(compRgb.r, compRgb.g, compRgb.b), rgb: compRgb },
    { label: 'Аналогичный 1', hex: rgbToHex(ana1Rgb.r, ana1Rgb.g, ana1Rgb.b), rgb: ana1Rgb },
    { label: 'Аналогичный 2', hex: rgbToHex(ana2Rgb.r, ana2Rgb.g, ana2Rgb.b), rgb: ana2Rgb },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Color picker area */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Box sx={{ display: 'flex', gap: 1.5 }} onMouseUp={handleMouseUp}>
              {/* SV square */}
              <Box sx={{ flex: 1 }}>
                <canvas
                  ref={svCanvasRef}
                  width={300}
                  height={300}
                  onMouseDown={handleSVMouseDown}
                  onMouseMove={handleSVMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1',
                    cursor: 'crosshair',
                    borderRadius: 8
                  }}
                />
              </Box>
              {/* Hue bar */}
              <Box sx={{ width: 32 }}>
                <canvas
                  ref={hueCanvasRef}
                  width={32}
                  height={300}
                  onMouseDown={handleHueMouseDown}
                  onMouseMove={handleHueMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '32/300',
                    cursor: 'pointer',
                    borderRadius: 8
                  }}
                />
              </Box>
            </Box>

            {/* Preview swatch */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: hex,
                  border: `2px solid ${theme.palette.divider}`,
                  flexShrink: 0
                }}
              />
              <Box sx={{ flex: 1 }}>
                <TextField
                  size="small"
                  label="HEX"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  fullWidth
                  slotProps={{
                    input: {
                      sx: { fontFamily: 'monospace', fontWeight: 600 }
                    }
                  }}
                />
              </Box>
              <Box>
                <input
                  type="color"
                  value={hex.length === 7 ? hex : '#000000'}
                  onChange={(e) => updateFromHex(e.target.value)}
                  style={{
                    width: 48,
                    height: 48,
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 8,
                    padding: 0,
                    backgroundColor: 'transparent'
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Controls & info */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* RGB sliders */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 2, borderRadius: 3 }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              RGB
            </Typography>
            {[
              { label: 'R', value: rgb.r, color: '#f44336' },
              { label: 'G', value: rgb.g, color: '#4caf50' },
              { label: 'B', value: rgb.b, color: '#2196f3' },
            ].map((ch) => (
              <Box key={ch.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, width: 14, color: ch.color }}>
                  {ch.label}
                </Typography>
                <Slider
                  size="small"
                  value={ch.value}
                  onChange={(_, v) => {
                    const newRgb = { ...rgb };
                    if (ch.label === 'R') newRgb.r = v as number;
                    if (ch.label === 'G') newRgb.g = v as number;
                    if (ch.label === 'B') newRgb.b = v as number;
                    updateFromRgb(newRgb.r, newRgb.g, newRgb.b, false);
                  }}
                  onChangeCommitted={() => addToRecent(hex)}
                  min={0}
                  max={255}
                  sx={{ flex: 1, color: ch.color }}
                />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', width: 28, textAlign: 'right' }}>
                  {ch.value}
                </Typography>
              </Box>
            ))}

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
              HSL
            </Typography>
            {[
              { label: 'H', value: hsl.h, max: 360, suffix: '°' },
              { label: 'S', value: hsl.s, max: 100, suffix: '%' },
              { label: 'L', value: hsl.l, max: 100, suffix: '%' },
            ].map((ch) => (
              <Box key={ch.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, width: 14 }}>
                  {ch.label}
                </Typography>
                <Slider
                  size="small"
                  value={ch.value}
                  onChange={(_, v) => {
                    const newHsl = { ...hsl };
                    if (ch.label === 'H') newHsl.h = v as number;
                    if (ch.label === 'S') newHsl.s = v as number;
                    if (ch.label === 'L') newHsl.l = v as number;
                    updateFromHsl(newHsl.h, newHsl.s, newHsl.l, false);
                  }}
                  onChangeCommitted={() => addToRecent(hex)}
                  min={0}
                  max={ch.max}
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', width: 36, textAlign: 'right' }}>
                  {ch.value}{ch.suffix}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Format outputs */}
      <Paper
        elevation={0}
        sx={{ p: 3, mt: 3, borderRadius: 3 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Форматы
        </Typography>
        <Grid container spacing={2}>
          {formats.map((fmt) => (
            <Grid size={{ xs: 12, sm: 6 }} key={fmt.key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  label={fmt.label}
                  value={fmt.value}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                      sx: { fontFamily: 'monospace', fontSize: '0.85rem' }
                    }
                  }}
                />
                <CopyButton text={fmt.value} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Related colors */}
      <Paper
        elevation={0}
        sx={{ p: 3, mt: 3, borderRadius: 3 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Связанные цвета
        </Typography>
        <Grid container spacing={2}>
          {relatedColors.map((rc) => (
            <Grid size={{ xs: 12, sm: 4 }} key={rc.label}>
              <Paper
                elevation={0}
                onClick={() => {
                  updateFromRgb(rc.rgb.r, rc.rgb.g, rc.rgb.b);
                }}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 48,
                    borderRadius: 1.5,
                    backgroundColor: rc.hex,
                    mb: 1,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {rc.label}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {rc.hex}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: 3, mt: 3, borderRadius: 3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Последние цвета
            </Typography>
            <IconButton size="small" onClick={() => setRecentColors([])}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentColors.map((c, i) => (
              <Tooltip key={`${c}-${i}`} title={c}>
                <IconButton
                  onClick={() => updateFromHex(c)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: c,
                    border: hex === c
                      ? `3px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    borderRadius: 1.5,
                    '&:hover': { backgroundColor: c, opacity: 0.85 }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
