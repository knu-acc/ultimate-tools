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
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

interface Fraction {
  num: number;
  den: number;
}

function simplify(f: Fraction): Fraction {
  if (f.den === 0) return f;
  const g = gcd(Math.abs(f.num), Math.abs(f.den));
  let num = f.num / g;
  let den = f.den / g;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

function toMixed(f: Fraction): { whole: number; num: number; den: number } | null {
  if (f.den === 0) return null;
  const s = simplify(f);
  if (Math.abs(s.num) < s.den) return null;
  const sign = s.num < 0 ? -1 : 1;
  const absNum = Math.abs(s.num);
  const whole = Math.floor(absNum / s.den) * sign;
  const remainder = absNum % s.den;
  if (remainder === 0) return null;
  return { whole, num: remainder, den: s.den };
}

export default function FractionCalc() {
  const theme = useTheme();
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [op, setOp] = useState<'+' | '-' | '\u00d7' | '\u00f7'>('+');
  const [showMixed, setShowMixed] = useState(false);

  const operations: { label: string; value: '+' | '-' | '\u00d7' | '\u00f7' }[] = [
    { label: '+', value: '+' },
    { label: '\u2212', value: '-' },
    { label: '\u00d7', value: '\u00d7' },
    { label: '\u00f7', value: '\u00f7' },
  ];

  const result = useMemo(() => {
    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) return null;
    if (d1 === 0 || d2 === 0) return null;
    if (op === '\u00f7' && n2 === 0) return null;

    const steps: string[] = [];
    let resultFrac: Fraction;

    const f1: Fraction = { num: n1, den: d1 };
    const f2: Fraction = { num: n2, den: d2 };

    if (op === '+' || op === '-') {
      const commonDen = lcm(d1, d2);
      const mult1 = commonDen / d1;
      const mult2 = commonDen / d2;
      const newNum1 = n1 * mult1;
      const newNum2 = n2 * mult2;

      steps.push(`\u041d\u0430\u0445\u043e\u0434\u0438\u043c \u041d\u041e\u041a \u0437\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u0435\u0439: \u041d\u041e\u041a(${d1}, ${d2}) = ${commonDen}`);
      steps.push(`\u041f\u0440\u0438\u0432\u043e\u0434\u0438\u043c \u043a \u043e\u0431\u0449\u0435\u043c\u0443 \u0437\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u044e:`);
      steps.push(`  ${n1}/${d1} = ${newNum1}/${commonDen} (\u0443\u043c\u043d\u043e\u0436\u0438\u043b\u0438 \u043d\u0430 ${mult1})`);
      steps.push(`  ${n2}/${d2} = ${newNum2}/${commonDen} (\u0443\u043c\u043d\u043e\u0436\u0438\u043b\u0438 \u043d\u0430 ${mult2})`);

      const resNum = op === '+' ? newNum1 + newNum2 : newNum1 - newNum2;
      steps.push(`${op === '+' ? '\u0421\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u043c' : '\u0412\u044b\u0447\u0438\u0442\u0430\u0435\u043c'} \u0447\u0438\u0441\u043b\u0438\u0442\u0435\u043b\u0438: ${newNum1} ${op} ${newNum2} = ${resNum}`);

      resultFrac = { num: resNum, den: commonDen };
    } else if (op === '\u00d7') {
      steps.push(`\u0423\u043c\u043d\u043e\u0436\u0430\u0435\u043c \u0447\u0438\u0441\u043b\u0438\u0442\u0435\u043b\u0438: ${n1} \u00d7 ${n2} = ${n1 * n2}`);
      steps.push(`\u0423\u043c\u043d\u043e\u0436\u0430\u0435\u043c \u0437\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u0438: ${d1} \u00d7 ${d2} = ${d1 * d2}`);
      resultFrac = { num: n1 * n2, den: d1 * d2 };
    } else {
      steps.push(`\u041f\u0435\u0440\u0435\u0432\u043e\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u043c \u0432\u0442\u043e\u0440\u0443\u044e \u0434\u0440\u043e\u0431\u044c: ${n2}/${d2} \u2192 ${d2}/${n2}`);
      steps.push(`\u0423\u043c\u043d\u043e\u0436\u0430\u0435\u043c: ${n1}/${d1} \u00d7 ${d2}/${n2}`);
      steps.push(`\u0427\u0438\u0441\u043b\u0438\u0442\u0435\u043b\u0438: ${n1} \u00d7 ${d2} = ${n1 * d2}`);
      steps.push(`\u0417\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u0438: ${d1} \u00d7 ${n2} = ${d1 * n2}`);
      resultFrac = { num: n1 * d2, den: d1 * n2 };
    }

    const simplified = simplify(resultFrac);
    const g = gcd(Math.abs(resultFrac.num), Math.abs(resultFrac.den));
    if (g > 1) {
      steps.push(`\u0421\u043e\u043a\u0440\u0430\u0449\u0430\u0435\u043c \u043d\u0430 \u041d\u041e\u0414(${Math.abs(resultFrac.num)}, ${Math.abs(resultFrac.den)}) = ${g}`);
      steps.push(`\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442: ${simplified.num}/${simplified.den}`);
    }

    const decimal = simplified.num / simplified.den;
    const mixed = toMixed(simplified);

    return {
      original: resultFrac,
      simplified,
      decimal,
      mixed,
      steps,
      f1,
      f2,
    };
  }, [num1, den1, num2, den2, op]);

  const FractionDisplay = ({
    num,
    den,
    large,
  }: {
    num: number | string;
    den: number | string;
    large?: boolean;
  }) => (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', mx: 0.5 }}>
      <Typography
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: large ? '1.3rem' : '1rem',
          lineHeight: 1.2,
        }}
      >
        {num}
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 2,
          backgroundColor: theme.palette.text.primary,
          my: 0.3,
        }}
      />
      <Typography
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: large ? '1.3rem' : '1rem',
          lineHeight: 1.2,
        }}
      >
        {den}
      </Typography>
    </Box>
  );

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
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0432\u0435 \u0434\u0440\u043e\u0431\u0438 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044e
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Fraction 1 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                \u0414\u0440\u043e\u0431\u044c 1
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="\u0427\u0438\u0441\u043b\u0438\u0442\u0435\u043b\u044c"
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                sx={{ mt: 1, mb: 1 }}
                slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
              />
              <TextField
                fullWidth
                size="small"
                label="\u0417\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u044c"
                type="number"
                value={den1}
                onChange={(e) => setDen1(e.target.value)}
                slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
              />
            </Paper>
          </Grid>

          {/* Operation */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {operations.map((o) => (
                <Button
                  key={o.value}
                  variant={op === o.value ? 'contained' : 'outlined'}
                  onClick={() => setOp(o.value)}
                  sx={{
                    minWidth: 44,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    textTransform: 'none',
                  }}
                >
                  {o.label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Fraction 2 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                \u0414\u0440\u043e\u0431\u044c 2
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="\u0427\u0438\u0441\u043b\u0438\u0442\u0435\u043b\u044c"
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                sx={{ mt: 1, mb: 1 }}
                slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
              />
              <TextField
                fullWidth
                size="small"
                label="\u0417\u043d\u0430\u043c\u0435\u043d\u0430\u0442\u0435\u043b\u044c"
                type="number"
                value={den2}
                onChange={(e) => setDen2(e.target.value)}
                slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch checked={showMixed} onChange={(e) => setShowMixed(e.target.checked)} />
            }
            label="\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043a\u0430\u043a \u0441\u043c\u0435\u0448\u0430\u043d\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e"
          />
        </Box>
      </Paper>

      {/* Result */}
      {result && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    \u0418\u0441\u0445\u043e\u0434\u043d\u0430\u044f \u0434\u0440\u043e\u0431\u044c
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <FractionDisplay num={result.original.num} den={result.original.den} large />
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    background: alpha(theme.palette.success.main, 0.06),
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {showMixed && result.mixed
                      ? '\u0421\u043c\u0435\u0448\u0430\u043d\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e'
                      : '\u0421\u043e\u043a\u0440\u0430\u0449\u0451\u043d\u043d\u0430\u044f \u0434\u0440\u043e\u0431\u044c'}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {showMixed && result.mixed ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Typography
                          sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.3rem' }}
                        >
                          {result.mixed.whole}
                        </Typography>
                        <FractionDisplay num={result.mixed.num} den={result.mixed.den} large />
                      </Box>
                    ) : (
                      <FractionDisplay
                        num={result.simplified.num}
                        den={result.simplified.den}
                        large
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    \u0414\u0435\u0441\u044f\u0442\u0438\u0447\u043d\u0430\u044f \u0434\u0440\u043e\u0431\u044c
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}
                  >
                    {Number.isFinite(result.decimal)
                      ? result.decimal.toLocaleString('ru-RU', { maximumFractionDigits: 8 })
                      : '\u2014'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Steps */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              \u041f\u043e\u0448\u0430\u0433\u043e\u0432\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435
            </Typography>
            {result.steps.map((step, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Chip
                  label={idx + 1}
                  size="small"
                  sx={{
                    minWidth: 28,
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                  }}
                />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
}
