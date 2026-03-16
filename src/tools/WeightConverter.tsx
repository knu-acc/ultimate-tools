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
import { useLanguage } from '@/src/i18n/LanguageContext';

interface WeightUnit {
  key: string;
  label: string;
  labelEn: string;
  short: string;
  shortEn: string;
  toGrams: number;
}

const units: WeightUnit[] = [
  { key: 'kg', label: 'Килограммы', labelEn: 'Kilograms', short: 'кг', shortEn: 'kg', toGrams: 1000 },
  { key: 'g', label: 'Граммы', labelEn: 'Grams', short: 'г', shortEn: 'g', toGrams: 1 },
  { key: 'mg', label: 'Миллиграммы', labelEn: 'Milligrams', short: 'мг', shortEn: 'mg', toGrams: 0.001 },
  { key: 'ton', label: 'Тонны', labelEn: 'Tonnes', short: 'т', shortEn: 't', toGrams: 1_000_000 },
  { key: 'lb', label: 'Фунты', labelEn: 'Pounds', short: 'фнт', shortEn: 'lb', toGrams: 453.59237 },
  { key: 'oz', label: 'Унции', labelEn: 'Ounces', short: 'унц', shortEn: 'oz', toGrams: 28.349523125 },
  { key: 'st', label: 'Стоуны', labelEn: 'Stones', short: 'стн', shortEn: 'st', toGrams: 6350.29318 },
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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
        label: isEn ? target.labelEn : target.label,
        short: isEn ? target.shortEn : target.short,
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
          borderRadius: 18
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
                    {isEn ? sourceUnit.shortEn : sourceUnit.short}
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
                {isEn ? u.labelEn : u.label} ({isEn ? u.shortEn : u.short})
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
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
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
