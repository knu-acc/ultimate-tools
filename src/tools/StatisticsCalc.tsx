'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

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
  const [input, setInput] = useState('');
  const [calculated, setCalculated] = useState(false);

  const parseNumbers = (str: string): number[] => {
    return str
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const stats = useMemo<Stats | null>(() => {
    if (!calculated) return null;
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
  }, [input, calculated]);

  const formatNum = (n: number): string => {
    if (Number.isInteger(n)) return n.toLocaleString('ru-RU');
    return parseFloat(n.toFixed(6)).toLocaleString('ru-RU', { maximumFractionDigits: 6 });
  };

  const statItems: { label: string; key: keyof Stats; color: string }[] = [
    { label: 'Количество', key: 'count', color: '#2196f3' },
    { label: 'Сумма', key: 'sum', color: '#4caf50' },
    { label: 'Среднее', key: 'mean', color: '#ff9800' },
    { label: 'Медиана', key: 'median', color: '#9c27b0' },
    { label: 'Минимум', key: 'min', color: '#00bcd4' },
    { label: 'Максимум', key: 'max', color: '#f44336' },
    { label: 'Размах', key: 'range', color: '#795548' },
    { label: 'Дисперсия', key: 'variance', color: '#607d8b' },
    { label: 'Стд. отклонение', key: 'stdDev', color: '#e91e63' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Введите числа через запятую, пробел или точку с запятой
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={input}
          onChange={(e) => { setInput(e.target.value); setCalculated(false); }}
          placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1rem',
            },
          }}
        />
        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCalculated(true)}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Рассчитать
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setInput(''); setCalculated(false); }}
            sx={{ textTransform: 'none' }}
          >
            Очистить
          </Button>
          {stats && (
            <Typography variant="body2" color="text.secondary">
              Распознано чисел: {stats.count}
            </Typography>
          )}
        </Box>
      </Paper>

      {calculated && !stats && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.error.main, 0.06),
          }}
        >
          <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
            Не удалось распознать числа. Проверьте ввод.
          </Typography>
        </Paper>
      )}

      {stats && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2.5 }}>
            Результаты
          </Typography>

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
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                      background: alpha(item.color, 0.04),
                      transition: 'all 200ms ease',
                      '&:hover': {
                        borderColor: item.color,
                        background: alpha(item.color, 0.08),
                      },
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
                        mt: 0.5,
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
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#673ab7', 0.04),
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: '#673ab7',
                    background: alpha('#673ab7', 0.08),
                  },
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Мода
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {stats.mode.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      Нет (все значения уникальны)
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
                            backgroundColor: alpha('#673ab7', 0.15),
                            color: '#673ab7',
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
