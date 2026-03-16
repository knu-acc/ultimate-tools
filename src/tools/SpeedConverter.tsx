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
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface SpeedUnit {
  key: string;
  label: string;
  labelEn: string;
  short: string;
  shortEn: string;
  toMs: number;
}

const units: SpeedUnit[] = [
  { key: 'kmh', label: 'Километры в час', labelEn: 'Kilometers per hour', short: 'км/ч', shortEn: 'km/h', toMs: 1 / 3.6 },
  { key: 'ms', label: 'Метры в секунду', labelEn: 'Meters per second', short: 'м/с', shortEn: 'm/s', toMs: 1 },
  { key: 'mph', label: 'Мили в час', labelEn: 'Miles per hour', short: 'миль/ч', shortEn: 'mph', toMs: 0.44704 },
  { key: 'knots', label: 'Узлы', labelEn: 'Knots', short: 'уз', shortEn: 'kn', toMs: 0.514444 },
  { key: 'fts', label: 'Футы в секунду', labelEn: 'Feet per second', short: 'фт/с', shortEn: 'ft/s', toMs: 0.3048 },
  { key: 'mach', label: 'Махи', labelEn: 'Mach', short: 'Мах', shortEn: 'Mach', toMs: 343 },
];

const barColors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];

function formatNumber(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1_000_000) return value.toExponential(4);
  if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(4);
  const str = value.toPrecision(10);
  return parseFloat(str).toString();
}

export default function SpeedConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [inputValue, setInputValue] = useState('100');
  const [fromUnit, setFromUnit] = useState('kmh');

  const numericValue = parseFloat(inputValue);
  const isValid = inputValue !== '' && !isNaN(numericValue) && isFinite(numericValue) && numericValue >= 0;

  const sourceUnit = units.find((u) => u.key === fromUnit)!;

  const allResults = units.map((target) => {
    const converted = isValid ? (numericValue * sourceUnit.toMs) / target.toMs : 0;
    return {
      key: target.key,
      label: isEn ? target.labelEn : target.label,
      short: isEn ? target.shortEn : target.short,
      value: converted,
      formatted: isValid ? formatNumber(converted) : '—'
    };
  });

  const otherResults = allResults.filter((r) => r.key !== fromUnit);
  const maxValue = Math.max(...allResults.map((r) => r.value), 1);

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
            placeholder="100"
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
            sx={{ minWidth: 200 }}
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
        <>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {otherResults.map((r) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
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

          {numericValue > 0 && (
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {isEn ? 'Comparison' : 'Сравнение'}
              </Typography>
              {allResults.map((r, idx) => {
                const percent = maxValue > 0 ? (r.value / maxValue) * 100 : 0;
                const color = barColors[idx % barColors.length];
                return (
                  <Box key={r.key} sx={{ mb: idx < allResults.length - 1 ? 1.5 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: r.key === fromUnit ? 700 : 500,
                          color: r.key === fromUnit ? theme.palette.primary.main : 'text.secondary'
                        }}
                      >
                        {r.short}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: r.key === fromUnit ? 700 : 400,
                          color: r.key === fromUnit ? theme.palette.primary.main : 'text.primary'
                        }}
                      >
                        {r.formatted}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percent, 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: alpha(color, 0.12),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor: r.key === fromUnit ? theme.palette.primary.main : color
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
