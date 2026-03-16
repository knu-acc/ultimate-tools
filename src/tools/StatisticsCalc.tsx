'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
}

export default function StatisticsCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');

  const parseNumbers = (str: string): number[] => {
    return str
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const stats = useMemo<Stats | null>(() => {
    const nums = parseNumbers(input);
    if (nums.length === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const count = nums.length;
    const sum = nums.reduce((acc, n) => acc + n, 0);
    const mean = sum / count;

    // Median
    let median: number;
    if (count % 2 === 0) {
      median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    } else {
      median = sorted[Math.floor(count / 2)];
    }

    // Mode
    const freq = new Map<number, number>();
    nums.forEach((n) => freq.set(n, (freq.get(n) || 0) + 1));
    const maxFreq = Math.max(...freq.values());
    const mode = maxFreq > 1
      ? [...freq.entries()].filter(([, f]) => f === maxFreq).map(([n]) => n).sort((a, b) => a - b)
      : [];

    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    // Variance (population)
    const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
    const stdDev = Math.sqrt(variance);

    return { count, sum, mean, median, mode, min, max, range, variance, stdDev };
  }, [input]);

  const formatNum = (n: number): string => {
    if (Number.isInteger(n)) return n.toLocaleString(isEn ? 'en-US' : 'ru-RU');
    return parseFloat(n.toFixed(6)).toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 6 });
  };

  const statItems: { label: string; key: keyof Stats; color: string }[] = [
    { label: isEn ? 'Count' : 'Количество', key: 'count', color: theme.palette.primary.main },
    { label: isEn ? 'Sum' : 'Сумма', key: 'sum', color: theme.palette.success.main },
    { label: isEn ? 'Mean' : 'Среднее', key: 'mean', color: theme.palette.warning.main },
    { label: isEn ? 'Median' : 'Медиана', key: 'median', color: theme.palette.secondary.main },
    { label: isEn ? 'Minimum' : 'Минимум', key: 'min', color: theme.palette.info.main },
    { label: isEn ? 'Maximum' : 'Максимум', key: 'max', color: theme.palette.error.main },
    { label: isEn ? 'Range' : 'Размах', key: 'range', color: theme.palette.warning.dark },
    { label: isEn ? 'Variance' : 'Дисперсия', key: 'variance', color: theme.palette.info.dark },
    { label: isEn ? 'Std. deviation' : 'Стд. отклонение', key: 'stdDev', color: theme.palette.error.light },
  ];

  const buildCopyText = (): string => {
    if (!stats) return '';
    const lines = statItems.map((item) => `${item.label}: ${formatNum(stats[item.key] as number)}`);
    const modeStr = stats.mode.length === 0
      ? (isEn ? 'Mode: none (all values are unique)' : 'Мода: нет (все значения уникальны)')
      : `${isEn ? 'Mode' : 'Мода'}: ${stats.mode.map(formatNum).join(', ')}`;
    return [...lines, modeStr].join('\n');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1, 2, 3, 4, 5"
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1rem'
            }
          }}
        />
        {stats && (
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {isEn ? `Numbers recognized: ${stats.count}` : `Распознано чисел: ${stats.count}`}
            </Typography>
            <CopyButton text={buildCopyText()} tooltip={isEn ? 'Copy all results' : 'Копировать все результаты'} />
          </Box>
        )}
      </Paper>

      {input.trim() && !stats && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 3,
            background: alpha(theme.palette.error.main, 0.06)
          }}
        >
          <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
            {isEn ? 'Could not recognize numbers. Check your input.' : 'Не удалось распознать числа. Проверьте ввод.'}
          </Typography>
        </Paper>
      )}

      {stats && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Grid container spacing={2}>
            {statItems.map((item) => {
              const value = stats[item.key];
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.key}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: alpha(item.color, 0.04),
                      transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                      '&:hover': {
                        borderColor: item.color,
                        background: alpha(item.color, 0.08)
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: item.color,
                        fontFamily: 'monospace',
                        mt: 0.5
                      }}
                    >
                      {formatNum(value as number)}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}

            {/* Mode - special card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.secondary.dark, 0.04),
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': {
                    borderColor: theme.palette.secondary.dark,
                    background: alpha(theme.palette.secondary.dark, 0.08)
                  }
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {isEn ? 'Mode' : 'Мода'}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {stats.mode.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      {isEn ? 'None (all values are unique)' : 'Нет (все значения уникальны)'}
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {stats.mode.map((m, i) => (
                        <Chip
                          key={i}
                          label={formatNum(m)}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            backgroundColor: alpha(theme.palette.secondary.dark, 0.15),
                            color: theme.palette.secondary.dark
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
