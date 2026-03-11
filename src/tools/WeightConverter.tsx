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
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface WeightUnit {
  key: string;
  label: string;
  short: string;
  toGrams: number;
}

const units: WeightUnit[] = [
  { key: 'kg', label: 'Килограммы', short: 'кг', toGrams: 1000 },
  { key: 'g', label: 'Граммы', short: 'г', toGrams: 1 },
  { key: 'mg', label: 'Миллиграммы', short: 'мг', toGrams: 0.001 },
  { key: 'ton', label: 'Тонны', short: 'т', toGrams: 1_000_000 },
  { key: 'lb', label: 'Фунты', short: 'фнт', toGrams: 453.59237 },
  { key: 'oz', label: 'Унции', short: 'унц', toGrams: 28.349523125 },
  { key: 'st', label: 'Стоуны', short: 'стн', toGrams: 6350.29318 },
];

function formatNumber(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1_000_000) return value.toExponential(4);
  if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(4);
  const str = value.toPrecision(10);
  return parseFloat(str).toString();
}

export default function WeightConverter() {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(inputValue);
  const isValid = inputValue !== '' && !isNaN(numericValue) && isFinite(numericValue) && numericValue >= 0;

  const sourceUnit = units.find((u) => u.key === fromUnit)!;

  const results = units
    .filter((u) => u.key !== fromUnit)
    .map((target) => {
      const converted = isValid ? (numericValue * sourceUnit.toGrams) / target.toGrams : 0;
      return {
        key: target.key,
        label: target.label,
        short: target.short,
        value: converted,
        formatted: isValid ? formatNumber(converted) : '—'
      };
    });

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 4
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Исходное значение
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
                setInputValue(v);
              }
            }}
            size="small"
            label="Значение"
            error={inputValue !== '' && !isValid}
            helperText={inputValue !== '' && !isValid ? 'Введите корректное число' : ''}
            sx={{
              flex: 1,
              minWidth: 180,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' }
            }}
          />
          <Select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            {units.map((u) => (
              <MenuItem key={u.key} value={u.key}>
                {u.label} ({u.short})
              </MenuItem>
            ))}
          </Select>
        </Box>

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
                  <IconButton
                    size="small"
                    onClick={() => copyValue(r.key, r.formatted)}
                    sx={{
                      color: copied === r.key ? theme.palette.success.main : 'text.secondary',
                      transition: 'color 200ms ease'
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    wordBreak: 'break-all'
                  }}
                >
                  {r.formatted}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}
                  >
                    {r.short}
                  </Typography>
                </Typography>
                {copied === r.key && (
                  <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                    Скопировано!
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {inputValue !== '' && !isValid && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 3,
              background: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
            }}
          >
            <Typography variant="body2" color="error">
              Пожалуйста, введите положительное число для конвертации.
            </Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
