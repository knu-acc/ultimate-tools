'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  InputBase,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

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

function FractionInput({
  num,
  den,
  onNumChange,
  onDenChange,
}: {
  num: string;
  den: string;
  onNumChange: (v: string) => void;
  onDenChange: (v: string) => void;
}) {
  const theme = useTheme();

  const inputSx = {
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '1.25rem',
    textAlign: 'center' as const,
    width: 64,
    py: 0.5,
    px: 1,
    borderRadius: 1.5,
    backgroundColor: theme.palette.surfaceContainerHigh,
    '& input': {
      textAlign: 'center',
      padding: 0,
      MozAppearance: 'textfield',
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
    },
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.25,
      }}
    >
      <InputBase
        type="number"
        value={num}
        onChange={(e) => onNumChange(e.target.value)}
        placeholder="0"
        sx={inputSx}
      />
      <Box
        sx={{
          width: 56,
          height: 2.5,
          borderRadius: 1,
          backgroundColor: theme.palette.text.primary,
        }}
      />
      <InputBase
        type="number"
        value={den}
        onChange={(e) => onDenChange(e.target.value)}
        placeholder="1"
        sx={inputSx}
      />
    </Box>
  );
}

function FractionDisplay({
  num,
  den,
  large,
}: {
  num: number | string;
  den: number | string;
  large?: boolean;
}) {
  const theme = useTheme();
  const fontSize = large ? '1.3rem' : '1rem';

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', mx: 0.5 }}>
      <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize, lineHeight: 1.2 }}>
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
      <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize, lineHeight: 1.2 }}>
        {den}
      </Typography>
    </Box>
  );
}

export default function FractionCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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

      steps.push(`\u041d\u041e\u041a(${d1}, ${d2}) = ${commonDen}`);
      steps.push(`${n1}/${d1} = ${newNum1}/${commonDen}`);
      steps.push(`${n2}/${d2} = ${newNum2}/${commonDen}`);

      const resNum = op === '+' ? newNum1 + newNum2 : newNum1 - newNum2;
      steps.push(`${newNum1} ${op === '+' ? '+' : '\u2212'} ${newNum2} = ${resNum}`);

      resultFrac = { num: resNum, den: commonDen };
    } else if (op === '\u00d7') {
      steps.push(`${n1} \u00d7 ${n2} = ${n1 * n2}`);
      steps.push(`${d1} \u00d7 ${d2} = ${d1 * d2}`);
      resultFrac = { num: n1 * n2, den: d1 * d2 };
    } else {
      steps.push(`${n2}/${d2} \u2192 ${d2}/${n2}`);
      steps.push(`${n1}/${d1} \u00d7 ${d2}/${n2}`);
      steps.push(`${n1} \u00d7 ${d2} = ${n1 * d2}`);
      steps.push(`${d1} \u00d7 ${n2} = ${d1 * n2}`);
      resultFrac = { num: n1 * d2, den: d1 * n2 };
    }

    const simplified = simplify(resultFrac);
    const g = gcd(Math.abs(resultFrac.num), Math.abs(resultFrac.den));
    if (g > 1) {
      steps.push(`\u041d\u041e\u0414 = ${g}, ${simplified.num}/${simplified.den}`);
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

  const resultText = result
    ? showMixed && result.mixed
      ? `${result.mixed.whole} ${result.mixed.num}/${result.mixed.den}`
      : `${result.simplified.num}/${result.simplified.den}`
    : '';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input row */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1.5, sm: 3 },
            flexWrap: 'wrap',
          }}
        >
          <FractionInput
            num={num1}
            den={den1}
            onNumChange={setNum1}
            onDenChange={setDen1}
          />

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {operations.map((o) => (
              <Button
                key={o.value}
                variant={op === o.value ? 'contained' : 'text'}
                onClick={() => setOp(o.value)}
                disableElevation
                sx={{
                  minWidth: 40,
                  height: 40,
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  ...(op !== o.value && {
                    color: 'text.secondary',
                    backgroundColor: theme.palette.surfaceContainerHigh,
                    '&:hover': {
                      backgroundColor: theme.palette.surfaceContainerHighest,
                    },
                  }),
                }}
              >
                {o.label}
              </Button>
            ))}
          </Box>

          <FractionInput
            num={num2}
            den={den2}
            onNumChange={setNum2}
            onDenChange={setDen2}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showMixed}
                onChange={(e) => setShowMixed(e.target.checked)}
              />
            }
            label={
              <Typography variant="caption" color="text.secondary">
                {isEn ? 'Mixed number' : '\u0421\u043c\u0435\u0448\u0430\u043d\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e'}
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>
      </Paper>

      {/* Result */}
      {result && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              background: theme.palette.surfaceContainerLow,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {isEn ? 'Original' : '\u0418\u0441\u0445\u043e\u0434\u043d\u0430\u044f'}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <FractionDisplay num={result.original.num} den={result.original.den} large />
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {showMixed && result.mixed
                        ? (isEn ? 'Mixed' : '\u0421\u043c\u0435\u0448\u0430\u043d\u043d\u043e\u0435')
                        : (isEn ? 'Simplified' : '\u0421\u043e\u043a\u0440\u0430\u0449\u0451\u043d\u043d\u0430\u044f')}
                    </Typography>
                    <CopyButton text={resultText} size="small" />
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    {showMixed && result.mixed ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.3rem' }}>
                          {result.mixed.whole}
                        </Typography>
                        <FractionDisplay num={result.mixed.num} den={result.mixed.den} large />
                      </Box>
                    ) : (
                      <FractionDisplay num={result.simplified.num} den={result.simplified.den} large />
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {isEn ? 'Decimal' : '\u0414\u0435\u0441\u044f\u0442\u0438\u0447\u043d\u0430\u044f'}
                    </Typography>
                    <CopyButton
                      text={
                        Number.isFinite(result.decimal)
                          ? result.decimal.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 8 })
                          : ''
                      }
                      size="small"
                    />
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '1.3rem',
                      color: 'primary.main',
                    }}
                  >
                    {Number.isFinite(result.decimal)
                      ? result.decimal.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 8 })
                      : '\u2014'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Steps */}
          {result.steps.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                background: theme.palette.surfaceContainerLow,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {result.steps.map((step, idx) => (
                  <Chip
                    key={idx}
                    label={step}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      backgroundColor: theme.palette.surfaceContainerHigh,
                      height: 28,
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
