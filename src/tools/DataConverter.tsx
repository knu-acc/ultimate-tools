'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Grid,
  Chip,
  useTheme } from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


type UnitKey =
  | 'bit' | 'byte'
  | 'kb' | 'mb' | 'gb' | 'tb' | 'pb'
  | 'kib' | 'mib' | 'gib';

interface UnitInfo {
  label: string;
  shortLabel: string;
  toBits: (v: number) => number;
  fromBits: (b: number) => number;
  binary: boolean;
}

const UNITS: Record<UnitKey, UnitInfo> = {
  bit:  { label: 'Биты',       shortLabel: 'бит',  toBits: (v) => v,                       fromBits: (b) => b,                       binary: false },
  byte: { label: 'Байты',      shortLabel: 'Б',    toBits: (v) => v * 8,                   fromBits: (b) => b / 8,                   binary: false },
  kb:   { label: 'Килобайты',   shortLabel: 'КБ',   toBits: (v) => v * 8 * 1e3,             fromBits: (b) => b / (8 * 1e3),           binary: false },
  mb:   { label: 'Мегабайты',   shortLabel: 'МБ',   toBits: (v) => v * 8 * 1e6,             fromBits: (b) => b / (8 * 1e6),           binary: false },
  gb:   { label: 'Гигабайты',   shortLabel: 'ГБ',   toBits: (v) => v * 8 * 1e9,             fromBits: (b) => b / (8 * 1e9),           binary: false },
  tb:   { label: 'Терабайты',   shortLabel: 'ТБ',   toBits: (v) => v * 8 * 1e12,            fromBits: (b) => b / (8 * 1e12),          binary: false },
  pb:   { label: 'Петабайты',   shortLabel: 'ПБ',   toBits: (v) => v * 8 * 1e15,            fromBits: (b) => b / (8 * 1e15),          binary: false },
  kib:  { label: 'Кибибайты',   shortLabel: 'КиБ',  toBits: (v) => v * 8 * 1024,            fromBits: (b) => b / (8 * 1024),          binary: true },
  mib:  { label: 'Мебибайты',   shortLabel: 'МиБ',  toBits: (v) => v * 8 * 1024 ** 2,       fromBits: (b) => b / (8 * 1024 ** 2),     binary: true },
  gib:  { label: 'Гибибайты',   shortLabel: 'ГиБ',  toBits: (v) => v * 8 * 1024 ** 3,       fromBits: (b) => b / (8 * 1024 ** 3),     binary: true }
};

const UNIT_KEYS = Object.keys(UNITS) as UnitKey[];
const DECIMAL_KEYS: UnitKey[] = ['bit', 'byte', 'kb', 'mb', 'gb', 'tb', 'pb'];
const BINARY_KEYS: UnitKey[] = ['bit', 'byte', 'kib', 'mib', 'gib'];

function formatValue(num: number): string {
  if (num === 0) return '0';
  if (Number.isInteger(num) && Math.abs(num) < 1e15) return num.toLocaleString('ru-RU');
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 0.0001 && num !== 0)) {
    return num.toExponential(6);
  }
  const fixed = num.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
  const parts = fixed.split('.');
  if (parts[1] && parts[1].length > 6) {
    return num.toFixed(6);
  }
  return fixed;
}

export default function DataConverter() {
  const theme = useTheme();
  const [input, setInput] = useState('1');
  const [unit, setUnit] = useState<UnitKey>('gb');
  const [mode, setMode] = useState<'decimal' | 'binary'>('decimal');
  const numericInput = parseFloat(input) || 0;
  const bits = UNITS[unit].toBits(numericInput);
  const displayKeys = mode === 'decimal' ? DECIMAL_KEYS : BINARY_KEYS;

  const results = displayKeys
    .filter((k) => k !== unit)
    .map((k) => ({
      key: k,
      label: UNITS[k].label,
      shortLabel: UNITS[k].shortLabel,
      value: formatValue(UNITS[k].fromBits(bits))
    }));

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 4
        }}
      >
        {/* Mode toggle */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label="Десятичная (×1000)"
            variant={mode === 'decimal' ? 'filled' : 'outlined'}
            color={mode === 'decimal' ? 'primary' : 'default'}
            onClick={() => {
              setMode('decimal');
              if (UNITS[unit].binary) setUnit('byte');
            }}
            sx={{ fontWeight: 600, borderRadius: 3, px: 1 }}
          />
          <Chip
            label="Двоичная (×1024)"
            variant={mode === 'binary' ? 'filled' : 'outlined'}
            color={mode === 'binary' ? 'primary' : 'default'}
            onClick={() => {
              setMode('binary');
              if (!UNITS[unit].binary && unit !== 'bit' && unit !== 'byte') setUnit('byte');
            }}
            sx={{ fontWeight: 600, borderRadius: 3, px: 1 }}
          />
        </Box>

        {/* Input row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Значение"
            value={input}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) setInput(v);
            }}
            size="small"
            sx={{
              flex: 2,
              minWidth: 160,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' }
            }}
          />
          <Select
            value={unit}
            onChange={(e) => setUnit(e.target.value as UnitKey)}
            size="small"
            sx={{ flex: 1, minWidth: 160 }}
          >
            {(mode === 'decimal' ? DECIMAL_KEYS : BINARY_KEYS).map((k) => (
              <MenuItem key={k} value={k}>
                {UNITS[k].label} ({UNITS[k].shortLabel})
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Info chip */}
        {numericInput !== 0 && (
          <Chip
            label={`${formatValue(numericInput)} ${UNITS[unit].shortLabel} = ${formatValue(bits)} бит`}
            variant="outlined"
            color="info"
            sx={{ mb: 2, fontFamily: 'monospace', borderRadius: 3 }}
          />
        )}

        {/* Result cards */}
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Результаты конвертации
        </Typography>
        <Grid container spacing={2}>
          {results.map((r) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.key}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.surfaceContainerLow
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {r.label}
                  </Typography>
                  <CopyButton text={r.value} size="small" />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 500,
                    fontSize: '1rem',
                    wordBreak: 'break-all'
                  }}
                >
                  {r.value} {r.shortLabel}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Empty state */}
        {numericInput === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
            Введите значение для конвертации
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
