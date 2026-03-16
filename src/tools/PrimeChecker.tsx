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

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function primeFactorization(n: number): { factor: number; power: number }[] {
  if (n < 2) return [];
  const factors: { factor: number; power: number }[] = [];
  let current = n;

  for (let i = 2; i * i <= current; i++) {
    if (current % i === 0) {
      let power = 0;
      while (current % i === 0) {
        power++;
        current /= i;
      }
      factors.push({ factor: i, power });
    }
  }
  if (current > 1) {
    factors.push({ factor: current, power: 1 });
  }
  return factors;
}

function getDivisors(n: number): number[] {
  if (n < 1) return [];
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i !== n / i) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

function nextPrime(n: number): number {
  let candidate = n + 1;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

function prevPrime(n: number): number | null {
  if (n <= 2) return null;
  let candidate = n - 1;
  while (candidate >= 2 && !isPrime(candidate)) candidate--;
  return candidate >= 2 ? candidate : null;
}

const superscript: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00b9',
  '2': '\u00b2',
  '3': '\u00b3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079'
};

function toSuperscript(n: number): string {
  return n
    .toString()
    .split('')
    .map((c) => superscript[c] || c)
    .join('');
}

export default function PrimeChecker() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');

  const quickNumbers = [2, 7, 13, 17, 23, 42, 97, 100, 127, 256, 997, 1009];

  const result = useMemo(() => {
    const n = parseInt(input);
    if (isNaN(n) || n < 1 || n > 999999999) return null;

    const prime = isPrime(n);
    const factors = primeFactorization(n);
    const divisors = getDivisors(n);
    const next = nextPrime(n);
    const prev = prevPrime(n);

    // Build factorization expression
    const factorizationStr = factors
      .map(({ factor, power }) => (power === 1 ? `${factor}` : `${factor}${toSuperscript(power)}`))
      .join(' \u00d7 ');

    return { n, prime, factors, factorizationStr, divisors, next, prev };
  }, [input]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
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
          placeholder="1 ... 999 999 999"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          slotProps={{
            input: { sx: { fontFamily: 'monospace', fontSize: '1.2rem' } }
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            {isEn ? 'Quick check' : 'Быстрая проверка'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {quickNumbers.map((num) => (
              <Chip
                key={num}
                label={num}
                size="small"
                onClick={() => setInput(num.toString())}
                sx={{
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  backgroundColor: theme.palette.surfaceContainerHigh,
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.16) }
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {result && (
        <>
          {/* Prime check result */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              textAlign: 'center',
              borderRadius: 3,
              background: alpha(
                result.prime ? theme.palette.success.main : theme.palette.error.main,
                0.06,
              )
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, mb: 1 }}>
              {result.n.toLocaleString(isEn ? 'en-US' : 'ru-RU')}
            </Typography>
            <Chip
              label={result.prime ? (isEn ? 'Prime number' : 'Простое число') : (isEn ? 'Composite number' : 'Составное число')}
              color={result.prime ? 'success' : 'error'}
              sx={{ fontWeight: 700, fontSize: '0.95rem', px: 2, py: 0.5 }}
            />
          </Paper>

          {/* Factorization */}
          {result.factors.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                borderRadius: 3,
                background: theme.palette.surfaceContainerLow
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {isEn ? 'Prime factorization' : 'Разложение на простые множители'}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: theme.palette.surfaceContainerLow
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'monospace', fontWeight: 700 }}
                  >
                    {result.n} = {result.factorizationStr}
                  </Typography>
                  <CopyButton text={`${result.n} = ${result.factorizationStr}`} />
                </Box>
              </Paper>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.factors.map(({ factor, power }) => (
                  <Chip
                    key={factor}
                    label={`${factor}${power > 1 ? ` (\u00d7${power})` : ''}`}
                    variant="outlined"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      color: 'primary.main'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          {/* Divisors */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {isEn ? 'Divisors' : 'Делители'}
              </Typography>
              <Chip
                label={isEn ? `${result.divisors.length} total` : `${result.divisors.length} шт.`}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main'
                }}
              />
              <CopyButton text={result.divisors.join(', ')} tooltip={isEn ? "Copy divisors" : "Копировать делители"} />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {result.divisors.map((d) => (
                <Chip
                  key={d}
                  label={d.toLocaleString(isEn ? 'en-US' : 'ru-RU')}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontWeight: 500 }}
                />
              ))}
            </Box>
          </Paper>

          {/* Neighboring primes */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.primary.main, 0.04),
                  transition: 'all 200ms ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.08) }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {isEn ? 'Previous prime' : 'Предыдущее простое'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.primary.main }}
                  >
                    {result.prev !== null ? result.prev.toLocaleString(isEn ? 'en-US' : 'ru-RU') : '\u2014'}
                  </Typography>
                  {result.prev !== null && (
                    <CopyButton text={result.prev.toString()} />
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.success.main, 0.04),
                  transition: 'all 200ms ease',
                  '&:hover': { background: alpha(theme.palette.success.main, 0.08) }
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {isEn ? 'Next prime' : 'Следующее простое'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.success.main }}
                  >
                    {result.next.toLocaleString(isEn ? 'en-US' : 'ru-RU')}
                  </Typography>
                  <CopyButton text={result.next.toString()} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
