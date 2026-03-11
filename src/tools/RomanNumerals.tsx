'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Chip,
  useTheme,
  alpha
} from '@mui/material';

interface ConversionEntry {
  input: string;
  output: string;
  direction: 'toRoman' | 'toArabic';
}

const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

const REFERENCE_VALUES: [number, string][] = [
  [1, 'I'], [2, 'II'], [3, 'III'], [4, 'IV'], [5, 'V'],
  [6, 'VI'], [7, 'VII'], [8, 'VIII'], [9, 'IX'], [10, 'X'],
  [11, 'XI'], [12, 'XII'], [13, 'XIII'], [14, 'XIV'], [15, 'XV'],
  [16, 'XVI'], [17, 'XVII'], [18, 'XVIII'], [19, 'XIX'], [20, 'XX'],
  [50, 'L'], [100, 'C'], [500, 'D'], [1000, 'M'],
];

function arabicToRoman(num: number): string | null {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) return null;
  let result = '';
  let remaining = num;
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function romanToArabic(str: string): number | null {
  const upper = str.toUpperCase().trim();
  if (!upper || !/^[MDCLXVI]+$/.test(upper)) return null;
  const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    const current = map[upper[i]];
    const next = i + 1 < upper.length ? map[upper[i + 1]] : 0;
    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  // Validate by converting back
  if (result <= 0 || result > 3999) return null;
  const check = arabicToRoman(result);
  if (check !== upper) return null;
  return result;
}

function detectMode(value: string): 'arabic' | 'roman' | 'unknown' {
  const trimmed = value.trim();
  if (!trimmed) return 'unknown';
  if (/^\d+$/.test(trimmed)) return 'arabic';
  if (/^[MDCLXVImdclxvi]+$/.test(trimmed)) return 'roman';
  return 'unknown';
}

export default function RomanNumerals() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ConversionEntry[]>([]);

  const mode = useMemo(() => detectMode(input), [input]);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    if (mode === 'arabic') {
      const num = parseInt(trimmed, 10);
      const roman = arabicToRoman(num);
      return roman
        ? { output: roman, direction: 'toRoman' as const, label: `${num} → ${roman}` }
        : { output: null, error: 'Число должно быть от 1 до 3999' };
    }

    if (mode === 'roman') {
      const num = romanToArabic(trimmed);
      return num !== null
        ? { output: String(num), direction: 'toArabic' as const, label: `${trimmed.toUpperCase()} → ${num}` }
        : { output: null, error: 'Некорректное римское число' };
    }

    return { output: null, error: 'Введите арабское число или римские цифры' };
  }, [input, mode]);

  const handleInputChange = (value: string) => {
    // Save previous valid result to history before changing
    if (result && result.output && result.direction) {
      const entry: ConversionEntry = {
        input: input.trim(),
        output: result.output,
        direction: result.direction
      };
      setHistory((prev) => {
        const exists = prev.some((h) => h.input === entry.input && h.direction === entry.direction);
        if (exists) return prev;
        return [entry, ...prev].slice(0, 20);
      });
    }
    setInput(value);
  };

  const modeLabel = mode === 'arabic'
    ? 'Арабское → Римское'
    : mode === 'roman'
      ? 'Римское → Арабское'
      : 'Автоопределение';

  const modeColor = mode === 'arabic'
    ? '#2196f3'
    : mode === 'roman'
      ? '#9c27b0'
      : theme.palette.text.secondary;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Введите число
          </Typography>
          <Chip
            label={modeLabel}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 24,
              fontWeight: 600,
              backgroundColor: alpha(modeColor, 0.12),
              color: modeColor
            }}
          />
        </Box>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="42 или XLII"
          error={!!input.trim() && result !== null && result.output === null}
          helperText={
            input.trim() && result && result.output === null
              ? ('error' in result ? result.error : undefined)
              : mode === 'unknown' && input.trim()
                ? 'Не удалось определить тип ввода'
                : undefined
          }
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1.3rem',
              letterSpacing: 1
            }
          }}
        />
      </Paper>

      {/* Result */}
      {result && result.output && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: `1px solid ${modeColor}`,
            backgroundColor: alpha(modeColor, 0.04),
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
            Результат
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: 2,
              color: modeColor
            }}
          >
            {result.output}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {result.label}
          </Typography>
        </Paper>
      )}

      {/* Reference Table */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Справочная таблица
        </Typography>
        <Grid container spacing={1}>
          {REFERENCE_VALUES.map(([num, roman]) => (
            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={num}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: '#9c27b0',
                    backgroundColor: alpha('#9c27b0', 0.04)
                  }
                }}
                onClick={() => setInput(String(num))}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#9c27b0' }}
                >
                  {roman}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {num}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* History */}
      {history.length > 0 && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
            История конвертаций
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {history.map((entry, i) => {
              const color = entry.direction === 'toRoman' ? '#2196f3' : '#9c27b0';
              return (
                <Chip
                  key={`${entry.input}-${entry.direction}-${i}`}
                  label={`${entry.input.toUpperCase()} → ${entry.output}`}
                  size="small"
                  onClick={() => setInput(entry.input)}
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    backgroundColor: alpha(color, 0.1),
                    color,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: alpha(color, 0.2) }
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
