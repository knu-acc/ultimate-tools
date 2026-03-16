'use client';

import { useState, useMemo } from 'react';
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');

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

  const result = useMemo<GcdResult | null>(() => {
    const nums = parseNumbers(input);
    if (nums.length < 2) return null;

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
  }, [input]);

  const formatNum = (n: number): string => {
    return n.toLocaleString(isEn ? 'en-US' : 'ru-RU');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="12, 18, 24"
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: 1
            }
          }}
        />
      </Paper>

      {result && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha(theme.palette.primary.main, 0.04),
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {isEn ? 'GCD (Greatest Common Divisor)' : 'НОД (наибольший общий делитель)'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main, fontFamily: 'monospace' }}
                  >
                    {formatNum(result.gcd)}
                  </Typography>
                  <CopyButton text={String(result.gcd)} />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${isEn ? 'GCD' : 'НОД'}(${result.numbers.join(', ')})`}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
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
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha(theme.palette.success.main, 0.04),
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': {
                    borderColor: theme.palette.success.main,
                    background: alpha(theme.palette.success.main, 0.08)
                  }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {isEn ? 'LCM (Least Common Multiple)' : 'НОК (наименьшее общее кратное)'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: theme.palette.success.main, fontFamily: 'monospace' }}
                  >
                    {formatNum(result.lcm)}
                  </Typography>
                  <CopyButton text={String(result.lcm)} />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${isEn ? 'LCM' : 'НОК'}(${result.numbers.join(', ')})`}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: alpha(theme.palette.success.main, 0.12),
                      color: theme.palette.success.main,
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, background: theme.palette.surfaceContainerLow }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {isEn ? 'Euclidean algorithm (step by step)' : 'Алгоритм Евклида (пошагово)'}
            </Typography>

            {result.steps.map((pairSteps, pairIdx) => (
              <Box key={pairIdx} sx={{ mb: pairIdx < result.steps.length - 1 ? 3 : 0 }}>
                {result.numbers.length > 2 && (
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                    {pairIdx === 0
                      ? `${isEn ? 'GCD' : 'НОД'}(${result.numbers[0]}, ${result.numbers[1]})`
                      : `${isEn ? 'GCD' : 'НОД'}(${formatNum(result.steps[pairIdx - 1][result.steps[pairIdx - 1].length - 1]?.b === 0
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
                      gap: 1,
                      mb: 0.5,
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
                        label={`${isEn ? 'GCD' : 'НОД'} = ${formatNum(step.b)}`}
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
                  borderRadius: 18,
                  background: alpha(theme.palette.info.main, 0.04)
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {isEn ? 'LCM(a, b) = |a × b| / GCD(a, b)' : 'НОК(a, b) = |a × b| / НОД(a, b)'}
                </Typography>
              </Paper>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
