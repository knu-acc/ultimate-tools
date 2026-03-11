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
  alpha
} from '@mui/material';

interface EuclidStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

interface GcdResult {
  gcd: number;
  lcm: number;
  steps: EuclidStep[][];
  numbers: number[];
}

export default function GcdLcm() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [calculated, setCalculated] = useState(false);

  const parseNumbers = (str: string): number[] => {
    return str
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
  };

  const euclidSteps = (a: number, b: number): { gcd: number; steps: EuclidStep[] } => {
    const steps: EuclidStep[] = [];
    let x = Math.max(a, b);
    let y = Math.min(a, b);
    while (y !== 0) {
      const q = Math.floor(x / y);
      const r = x % y;
      steps.push({ a: x, b: y, q, r });
      x = y;
      y = r;
    }
    return { gcd: x, steps };
  };

  const result = useMemo<GcdResult | string | null>(() => {
    if (!calculated) return null;
    const nums = parseNumbers(input);
    if (nums.length < 2) return 'Введите минимум 2 натуральных числа';

    const allSteps: EuclidStep[][] = [];

    // GCD of all numbers
    let currentGcd = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const { gcd, steps } = euclidSteps(currentGcd, nums[i]);
      allSteps.push(steps);
      currentGcd = gcd;
    }

    // LCM: lcm(a,b) = a*b/gcd(a,b), extended for multiple numbers
    let currentLcm = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const { gcd } = euclidSteps(currentLcm, nums[i]);
      currentLcm = (currentLcm * nums[i]) / gcd;
    }

    return { gcd: currentGcd, lcm: currentLcm, steps: allSteps, numbers: nums };
  }, [input, calculated]);

  const formatNum = (n: number): string => {
    return n.toLocaleString('ru-RU');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Введите натуральные числа через запятую (минимум 2)
        </Typography>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => { setInput(e.target.value); setCalculated(false); }}
          placeholder="12, 18, 24"
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: 1
            }
          }}
        />
        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCalculated(true)}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Вычислить
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setInput(''); setCalculated(false); }}
            sx={{ textTransform: 'none' }}
          >
            Очистить
          </Button>
        </Box>
      </Paper>

      {typeof result === 'string' && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            textAlign: 'center',
            background: alpha(theme.palette.error.main, 0.06)
          }}
        >
          <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
            {result}
          </Typography>
        </Paper>
      )}

      {result && typeof result === 'object' && (
        <>
          {/* Results */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha('#2196f3', 0.04),
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: '#2196f3',
                    background: alpha('#2196f3', 0.08)
                  }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  НОД (наибольший общий делитель)
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: '#2196f3', fontFamily: 'monospace' }}
                >
                  {formatNum(result.gcd)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`НОД(${result.numbers.join(', ')})`}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: alpha('#2196f3', 0.12),
                      color: '#2196f3',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha('#4caf50', 0.04),
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: '#4caf50',
                    background: alpha('#4caf50', 0.08)
                  }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  НОК (наименьшее общее кратное)
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: '#4caf50', fontFamily: 'monospace' }}
                >
                  {formatNum(result.lcm)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`НОК(${result.numbers.join(', ')})`}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: alpha('#4caf50', 0.12),
                      color: '#4caf50',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Euclidean algorithm steps */}
          <Paper
            elevation={0}
            sx={{
              p: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Алгоритм Евклида (пошагово)
            </Typography>

            {result.steps.map((pairSteps, pairIdx) => (
              <Box key={pairIdx} sx={{ mb: pairIdx < result.steps.length - 1 ? 3 : 0 }}>
                {result.numbers.length > 2 && (
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                    {pairIdx === 0
                      ? `НОД(${result.numbers[0]}, ${result.numbers[1]})`
                      : `НОД(${formatNum(result.steps[pairIdx - 1][result.steps[pairIdx - 1].length - 1]?.b === 0
                          ? result.steps[pairIdx - 1][result.steps[pairIdx - 1].length - 1].a
                          : pairSteps[0]?.a ?? 0)}, ${result.numbers[pairIdx + 1]})`}
                  </Typography>
                )}

                {pairSteps.map((step, stepIdx) => (
                  <Box
                    key={stepIdx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 1,
                      pl: 1
                    }}
                  >
                    <Chip
                      label={stepIdx + 1}
                      size="small"
                      sx={{
                        minWidth: 28,
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: theme.palette.surfaceContainerHigh,
                        color: 'primary.main'
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    >
                      {formatNum(step.a)} = {formatNum(step.b)} × {formatNum(step.q)} + {formatNum(step.r)}
                    </Typography>
                    {step.r === 0 && (
                      <Chip
                        label={`НОД = ${formatNum(step.b)}`}
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            ))}

            {result.numbers.length >= 2 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 3,
                  background: alpha(theme.palette.info.main, 0.04)
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  НОК вычисляется по формуле: НОК(a, b) = |a × b| / НОД(a, b)
                </Typography>
              </Paper>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
