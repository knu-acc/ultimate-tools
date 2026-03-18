'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, Tooltip,
  useTheme, alpha, Snackbar
} from '@mui/material';
import {
  Refresh, Lock, LockOpen, Undo, Redo, ContentCopy, Palette, History
} from '@mui/icons-material';
import { CopyButton, copyText } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

// ---------------------------------------------------------------------------
// Color utilities
// ---------------------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
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

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r: rRaw, g: gRaw, b: bRaw } = hexToRgb(hex);
  const r = rRaw / 255;
  const g = gRaw / 255;
  const b = bRaw / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ---------------------------------------------------------------------------
// Scheme types & palette generation
// ---------------------------------------------------------------------------

type SchemeType = 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'monochromatic';

const SCHEME_TYPES: SchemeType[] = [
  'analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic'
];

const SCHEME_LABELS: Record<SchemeType, { en: string; ru: string }> = {
  analogous: { en: 'Analogous', ru: 'Аналоговая' },
  complementary: { en: 'Complementary', ru: 'Комплементарная' },
  triadic: { en: 'Triadic', ru: 'Триадная' },
  'split-complementary': { en: 'Split-Complementary', ru: 'Расщепл.-компл.' },
  monochromatic: { en: 'Monochromatic', ru: 'Монохромная' },
};

function generateHues(baseHue: number, scheme: SchemeType, count: number): number[] {
  const hues: number[] = [];
  switch (scheme) {
    case 'analogous': {
      const spread = Math.min(30, 150 / count);
      const start = baseHue - ((count - 1) * spread) / 2;
      for (let i = 0; i < count; i++) {
        hues.push((start + i * spread + 360) % 360);
      }
      break;
    }
    case 'complementary': {
      const half = Math.ceil(count / 2);
      for (let i = 0; i < half; i++) {
        hues.push((baseHue + i * 8 - ((half - 1) * 4)) % 360);
      }
      for (let i = 0; i < count - half; i++) {
        hues.push((baseHue + 180 + i * 8 - ((count - half - 1) * 4) + 360) % 360);
      }
      break;
    }
    case 'triadic': {
      const anchors = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      for (let i = 0; i < count; i++) {
        const anchor = anchors[i % 3];
        const offset = Math.floor(i / 3) * 10;
        hues.push((anchor + offset) % 360);
      }
      break;
    }
    case 'split-complementary': {
      const anchors = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
      for (let i = 0; i < count; i++) {
        const anchor = anchors[i % 3];
        const offset = Math.floor(i / 3) * 12;
        hues.push((anchor + offset) % 360);
      }
      break;
    }
    case 'monochromatic': {
      for (let i = 0; i < count; i++) {
        hues.push(baseHue);
      }
      break;
    }
  }
  return hues;
}

function generatePalette(count: number, schemeOverride?: SchemeType): { colors: string[]; scheme: SchemeType } {
  const scheme = schemeOverride ?? SCHEME_TYPES[Math.floor(Math.random() * SCHEME_TYPES.length)];
  const baseHue = Math.floor(Math.random() * 360);
  const hues = generateHues(baseHue, scheme, count);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = hues[i];
    let saturation: number;
    let lightness: number;

    if (scheme === 'monochromatic') {
      saturation = clamp(randRange(40, 80), 15, 95);
      const step = 55 / Math.max(count - 1, 1);
      lightness = clamp(25 + i * step + randRange(-4, 4), 15, 85);
    } else {
      saturation = clamp(randRange(55, 85), 30, 95);
      lightness = clamp(randRange(35, 65) + (i % 2 === 0 ? 5 : -5), 20, 80);
    }
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return { colors, scheme };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaletteState {
  colors: string[];
  locked: boolean[];
  scheme: SchemeType;
}

interface HistoryEntry {
  colors: string[];
  scheme: SchemeType;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLOR_COUNTS = [3, 4, 5, 6, 7, 8] as const;
const MAX_UNDO = 50;
const MAX_HISTORY = 10;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ColorPalette() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [colorCount, setColorCount] = useState<number>(5);
  const [palette, setPalette] = useState<PaletteState>(() => {
    const gen = generatePalette(5);
    return { colors: gen.colors, locked: Array(5).fill(false), scheme: gen.scheme };
  });
  const [undoStack, setUndoStack] = useState<PaletteState[]>([]);
  const [redoStack, setRedoStack] = useState<PaletteState[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  // Push current state to undo stack
  const pushUndo = useCallback((current: PaletteState) => {
    setUndoStack(prev => {
      const next = [...prev, current];
      if (next.length > MAX_UNDO) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  // Regenerate palette
  const regenerate = useCallback(() => {
    pushUndo(palette);
    const gen = generatePalette(colorCount);
    const newColors = gen.colors.map((c, i) =>
      palette.locked[i] && i < palette.colors.length ? palette.colors[i] : c
    );
    const newState: PaletteState = {
      colors: newColors,
      locked: palette.locked,
      scheme: gen.scheme,
    };
    setPalette(newState);
    setHistory(prev => {
      const next = [{ colors: newColors, scheme: gen.scheme }, ...prev];
      return next.slice(0, MAX_HISTORY);
    });
  }, [palette, colorCount, pushUndo]);

  // Undo
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [palette, ...prev]);
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setPalette(prev);
    setColorCount(prev.colors.length);
  }, [undoStack, palette]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, palette]);
    const next = redoStack[0];
    setRedoStack(s => s.slice(1));
    setPalette(next);
    setColorCount(next.colors.length);
  }, [redoStack, palette]);

  // Change color count
  const handleColorCountChange = useCallback((count: number) => {
    if (count === colorCount) return;
    pushUndo(palette);
    setColorCount(count);
    const gen = generatePalette(count);
    const newColors = gen.colors.map((c, i) =>
      palette.locked[i] && i < palette.colors.length ? palette.colors[i] : c
    );
    const newLocked = Array(count).fill(false).map((_, i) =>
      i < palette.locked.length ? palette.locked[i] : false
    );
    setPalette({ colors: newColors, locked: newLocked, scheme: gen.scheme });
  }, [colorCount, palette, pushUndo]);

  // Toggle lock
  const toggleLock = useCallback((index: number) => {
    setPalette(prev => ({
      ...prev,
      locked: prev.locked.map((v, i) => i === index ? !v : v),
    }));
  }, []);

  // Copy single hex
  const handleCopyHex = useCallback(async (hex: string) => {
    await copyText(hex);
    setCopiedHex(hex);
    setSnackOpen(true);
    setTimeout(() => setCopiedHex(null), 1500);
  }, []);

  // Restore from history
  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    pushUndo(palette);
    const newLocked = Array(entry.colors.length).fill(false);
    setColorCount(entry.colors.length);
    setPalette({ colors: entry.colors, locked: newLocked, scheme: entry.scheme });
  }, [palette, pushUndo]);

  // Keyboard: Space to regenerate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [regenerate]);

  // CSS variables export text
  const cssExport = useMemo(() => {
    const vars = palette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
    return `:root {\n${vars}\n}`;
  }, [palette.colors]);

  // Scheme label
  const schemeLabel = isEn ? SCHEME_LABELS[palette.scheme].en : SCHEME_LABELS[palette.scheme].ru;

  return (
    <Box ref={containerRef} sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 3 } }}>

      {/* --- Scheme indicator + Color count chips --- */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        mb: 2.5,
      }}>
        {/* Scheme badge */}
        <Chip
          icon={<Palette sx={{ fontSize: 18 }} />}
          label={schemeLabel}
          variant="outlined"
          sx={{
            borderRadius: 12,
            fontWeight: 600,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: theme.palette.primary.main,
          }}
        />

        {/* Color count selector */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {COLOR_COUNTS.map(n => (
            <Chip
              key={n}
              label={n}
              size="small"
              onClick={() => handleColorCountChange(n)}
              sx={{
                fontWeight: 700,
                minWidth: 36,
                borderRadius: 10,
                bgcolor: n === colorCount
                  ? theme.palette.primary.main
                  : theme.palette.surfaceContainerHigh,
                color: n === colorCount
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                transitionProperty: 'background-color, color, box-shadow',
                transitionDuration: '200ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  bgcolor: n === colorCount
                    ? theme.palette.primary.dark
                    : theme.palette.surfaceContainerHighest,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* --- Main palette strip --- */}
      <Box
        sx={{
          display: 'flex',
          borderRadius: '18px',
          overflow: 'hidden',
          height: { xs: 180, sm: 220, md: 280 },
          mb: 2,
          boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        {palette.colors.map((color, i) => {
          const contrast = getContrastColor(color);
          const isHovered = hoveredIndex === i;
          return (
            <Box
              key={`${i}-${color}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCopyHex(color)}
              sx={{
                flex: isHovered ? 1.4 : 1,
                bgcolor: color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transitionProperty: 'flex',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                userSelect: 'none',
              }}
            >
              {/* Lock button */}
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  color: contrast,
                  opacity: palette.locked[i] ? 0.9 : (isHovered ? 0.6 : 0),
                  transitionProperty: 'opacity',
                  transitionDuration: '200ms',
                  '&:hover': { opacity: 1, bgcolor: alpha(contrast, 0.12) },
                }}
              >
                {palette.locked[i]
                  ? <Lock sx={{ fontSize: 18 }} />
                  : <LockOpen sx={{ fontSize: 18 }} />
                }
              </IconButton>

              {/* HEX label */}
              <Typography
                sx={{
                  color: contrast,
                  fontWeight: 700,
                  fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.95rem' },
                  fontFamily: 'monospace',
                  opacity: isHovered ? 1 : 0.85,
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '200ms',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {color}
              </Typography>

              {/* Copy icon on hover */}
              <Box sx={{
                opacity: isHovered ? 1 : 0,
                transitionProperty: 'opacity',
                transitionDuration: '200ms',
                mt: 0.5,
              }}>
                <ContentCopy sx={{ fontSize: 16, color: contrast, opacity: 0.7 }} />
              </Box>

              {/* RGB sub-label on hover */}
              {isHovered && (
                <Typography
                  sx={{
                    color: contrast,
                    fontSize: '0.6rem',
                    opacity: 0.6,
                    mt: 0.3,
                    fontFamily: 'monospace',
                  }}
                >
                  {(() => { const { r, g, b } = hexToRgb(color); return `${r}, ${g}, ${b}`; })()}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* --- Action buttons --- */}
      <Box sx={{
        display: 'flex',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 3,
      }}>
        <Tooltip title={isEn ? 'Undo' : 'Отменить'}>
          <span>
            <IconButton
              onClick={undo}
              disabled={undoStack.length === 0}
              sx={{
                bgcolor: theme.palette.surfaceContainerHigh,
                borderRadius: 12,
                '&:hover': { bgcolor: theme.palette.surfaceContainerHighest },
              }}
            >
              <Undo fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={isEn ? 'Redo' : 'Повторить'}>
          <span>
            <IconButton
              onClick={redo}
              disabled={redoStack.length === 0}
              sx={{
                bgcolor: theme.palette.surfaceContainerHigh,
                borderRadius: 12,
                '&:hover': { bgcolor: theme.palette.surfaceContainerHighest },
              }}
            >
              <Redo fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={regenerate}
          sx={{
            borderRadius: 18,
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          {isEn ? 'Generate' : 'Генерировать'}
        </Button>

        <Chip
          label={isEn ? 'Space' : 'Пробел'}
          size="small"
          variant="outlined"
          sx={{
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            opacity: 0.6,
            borderColor: alpha(theme.palette.text.secondary, 0.2),
          }}
        />

        <CopyButton text={palette.colors.join(', ')} tooltip={isEn ? 'Copy all' : 'Копировать все'} />
      </Box>

      {/* --- Color detail cards --- */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: `repeat(${Math.min(palette.colors.length, 8)}, 1fr)`,
        },
        gap: 1.5,
        mb: 3,
      }}>
        {palette.colors.map((color, i) => {
          const rgb = hexToRgb(color);
          const hsl = hexToHsl(color);
          return (
            <Paper
              key={`${i}-${color}`}
              elevation={0}
              onClick={() => handleCopyHex(color)}
              sx={{
                p: 1.5,
                borderRadius: '18px',
                bgcolor: theme.palette.surfaceContainerLow,
                cursor: 'pointer',
                transitionProperty: 'background-color, transform',
                transitionDuration: '200ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{
                width: '100%',
                height: 36,
                borderRadius: '10px',
                bgcolor: color,
                mb: 1,
                position: 'relative',
              }}>
                {palette.locked[i] && (
                  <Lock sx={{
                    fontSize: 14,
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: getContrastColor(color),
                    opacity: 0.6,
                  }} />
                )}
              </Box>
              <Typography variant="body2" fontWeight={700} fontFamily="monospace" sx={{ fontSize: '0.78rem' }}>
                {color}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                RGB({rgb.r}, {rgb.g}, {rgb.b})
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                HSL({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* --- History panel --- */}
      {history.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '18px',
            bgcolor: theme.palette.surfaceContainerLow,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <History sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            <Typography variant="subtitle2" fontWeight={600}>
              {isEn ? 'Recent Palettes' : 'Недавние палитры'}
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: 260,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.text.secondary, 0.2),
              borderRadius: 2,
            },
          }}>
            {history.map((entry, hIdx) => (
              <Box
                key={hIdx}
                onClick={() => restoreFromHistory(entry)}
                sx={{
                  display: 'flex',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: 36,
                  cursor: 'pointer',
                  transitionProperty: 'transform, box-shadow',
                  transitionDuration: '200ms',
                  transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                  },
                }}
              >
                {entry.colors.map((c, cIdx) => (
                  <Box key={cIdx} sx={{ flex: 1, bgcolor: c }} />
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* --- CSS Variables export --- */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '18px',
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {isEn ? 'CSS Variables' : 'CSS переменные'}
          </Typography>
          <CopyButton text={cssExport} tooltip={isEn ? 'Copy CSS' : 'Копировать CSS'} />
        </Box>
        <Box
          component="pre"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            m: 0,
            p: 1.5,
            borderRadius: '10px',
            bgcolor: alpha(theme.palette.common.black, 0.03),
            whiteSpace: 'pre-wrap',
            color: theme.palette.text.secondary,
            overflowX: 'auto',
          }}
        >
          {cssExport}
        </Box>
      </Paper>

      {/* --- Copy snackbar --- */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={1500}
        onClose={() => setSnackOpen(false)}
        message={copiedHex ? `${isEn ? 'Copied' : 'Скопировано'}: ${copiedHex}` : (isEn ? 'Copied!' : 'Скопировано!')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '12px',
            fontWeight: 600,
            minWidth: 'auto',
          },
        }}
      />
    </Box>
  );
}
