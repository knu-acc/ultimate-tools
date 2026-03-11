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
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface EnergyUnit {
  key: string;
  label: string;
  short: string;
  toJoule: number; // conversion factor to Joules
}

const units: EnergyUnit[] = [
  { key: 'joule', label: 'Джоули', short: 'Дж', toJoule: 1 },
  { key: 'calorie', label: 'Калории', short: 'кал', toJoule: 4.184 },
  { key: 'kcal', label: 'Килокалории', short: 'ккал', toJoule: 4184 },
  { key: 'kwh', label: 'Киловатт-часы', short: 'кВт·ч', toJoule: 3_600_000 },
  { key: 'btu', label: 'Британские тепловые единицы', short: 'BTU', toJoule: 1055.06 },
  { key: 'ev', label: 'Электронвольты', short: 'эВ', toJoule: 1.602176634e-19 },
  { key: 'erg', label: 'Эрги', short: 'эрг', toJoule: 1e-7 },
];

const barColors = [
  '#2196f3',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#f44336',
  '#00bcd4',
  '#e91e63',
];

function formatNumber(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1_000_000) return value.toExponential(4);
  if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(4);
  const str = value.toPrecision(10);
  return parseFloat(str).toString();
}

export default function EnergyConverter() {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('joule');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(inputValue);
  const isValid = inputValue !== '' && !isNaN(numericValue) && isFinite(numericValue) && numericValue >= 0;

  const sourceUnit = units.find((u) => u.key === fromUnit)!;

  const allResults = units.map((target) => {
    const converted = isValid ? (numericValue * sourceUnit.toJoule) / target.toJoule : 0;
    return {
      key: target.key,
      label: target.label,
      short: target.short,
      value: converted,
      formatted: isValid ? formatNumber(converted) : '—'
    };
  });

  const otherResults = allResults.filter((r) => r.key !== fromUnit);

  const maxValue = Math.max(...allResults.map((r) => r.value), 1);

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
            sx={{ minWidth: 260 }}
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
          {otherResults.map((r) => (
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

        {/* Visual energy comparison */}
        {isValid && numericValue > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Визуальное сравнение величин
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3
              }}
            >
              {allResults.map((r, idx) => {
                const percent = maxValue > 0 ? (r.value / maxValue) * 100 : 0;
                const color = barColors[idx % barColors.length];
                return (
                  <Box key={r.key} sx={{ mb: idx < allResults.length - 1 ? 2 : 0 }}>
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
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: alpha(color, 0.15),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          backgroundColor: r.key === fromUnit ? theme.palette.primary.main : color
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Box>
        )}

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
