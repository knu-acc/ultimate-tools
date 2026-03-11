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
  '9': '\u2079',
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
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043b\u043e \u0434\u043b\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 (\u043e\u0442 1 \u0434\u043e 999 999 999)
        </Typography>
        <TextField
          fullWidth
          label="\u0427\u0438\u0441\u043b\u043e"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          slotProps={{
            input: { sx: { fontFamily: 'monospace', fontSize: '1.2rem' } },
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.16) },
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
              p: 3,
              mb: 3,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: alpha(
                result.prime ? theme.palette.success.main : theme.palette.error.main,
                0.06,
              ),
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, mb: 1 }}>
              {result.n.toLocaleString('ru-RU')}
            </Typography>
            <Chip
              label={result.prime ? '\u041f\u0440\u043e\u0441\u0442\u043e\u0435 \u0447\u0438\u0441\u043b\u043e' : '\u0421\u043e\u0441\u0442\u0430\u0432\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e'}
              color={result.prime ? 'success' : 'error'}
              sx={{ fontWeight: 700, fontSize: '0.95rem', px: 2, py: 0.5 }}
            />
          </Paper>

          {/* Factorization */}
          {result.factors.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                \u0420\u0430\u0437\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0440\u043e\u0441\u0442\u044b\u0435 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u0438
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha(theme.palette.primary.main, 0.04),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontFamily: 'monospace', fontWeight: 700 }}
                >
                  {result.n} = {result.factorizationStr}
                </Typography>
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
                      color: 'primary.main',
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
              p: 3,
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                \u0414\u0435\u043b\u0438\u0442\u0435\u043b\u0438
              </Typography>
              <Chip
                label={`${result.divisors.length} \u0448\u0442.`}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {result.divisors.map((d) => (
                <Chip
                  key={d}
                  label={d.toLocaleString('ru-RU')}
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
                  p: 3,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#2196f3', 0.04),
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  \u041f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u043e\u0435
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#2196f3' }}
                >
                  {result.prev !== null ? result.prev.toLocaleString('ru-RU') : '\u2014'}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#4caf50', 0.04),
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u043e\u0435
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4caf50' }}
                >
                  {result.next.toLocaleString('ru-RU')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
