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
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';

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
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('kg');

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
        formatted: isValid ? formatNumber(converted) : '—'
      };
    });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^-?\d*\.?\d*$/.test(v)) setInputValue(v);
            }}
            placeholder="1"
            error={inputValue !== '' && !isValid}
            sx={{
              flex: 1,
              minWidth: 180,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {sourceUnit.short}
                  </Typography>
                )
              }
            }}
          />
          <Select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {units.map((u) => (
              <MenuItem key={u.key} value={u.key}>
                {u.label} ({u.short})
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Paper>

      {isValid && (
        <Grid container spacing={1.5}>
          {results.map((r) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.key}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 200ms ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {r.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-all' }}
                  >
                    {r.formatted}
                    <Typography component="span" variant="body2" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}>
                      {r.short}
                    </Typography>
                  </Typography>
                </Box>
                <CopyButton text={r.formatted} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
