'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedEquation {
  a: number; // coefficient of x^2
  b: number; // coefficient of x
  c: number; // constant term
  type: 'linear' | 'quadratic';
  original: string;
}

interface SolveResult {
  equation: ParsedEquation;
  steps: string[];
  roots: number[];
  discriminant?: number;
  rootType: 'one' | 'two' | 'none' | 'identity' | 'no-solution';
  answerText: string;
}

// ─── Formatting helpers ──────────────────────────────────────────────────────

function formatNum(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(6)).toString();
}

/** Replace x^2 with x² in display strings */
function prettify(s: string): string {
  return s.replace(/x\^2/g, 'x\u00B2');
}

// ─── Equation Parser ─────────────────────────────────────────────────────────

/**
 * Parse a string equation into coefficients a, b, c where ax^2 + bx + c = 0.
 * Supports: "2x^2 + 4x - 6 = 0", "x^2 - 4 = 0", "2x + 5 = 0", "-x + 7 = 0",
 *           "5x = 10", "2x + 3 = 5", "x^2 = 9", etc.
 */
function parseEquation(input: string): ParsedEquation | null {
  const raw = input.trim();
  if (!raw) return null;

  // Split by '='
  const eqParts = raw.split('=');
  if (eqParts.length !== 2) return null;

  const leftStr = eqParts[0].trim();
  const rightStr = eqParts[1].trim();

  // Parse each side into coefficients
  const left = parseSide(leftStr);
  const right = parseSide(rightStr);
  if (!left || !right) return null;

  // Move everything to the left: left - right = 0
  const a = left.a - right.a;
  const b = left.b - right.b;
  const c = left.c - right.c;

  const type = a !== 0 ? 'quadratic' : 'linear';

  return { a, b, c, type, original: raw };
}

/**
 * Parse one side of the equation into { a, b, c } coefficients.
 * Handles terms like: 3x^2, -x^2, x^2, 2x, -x, x, 5, -3, etc.
 */
function parseSide(expr: string): { a: number; b: number; c: number } | null {
  let s = expr.replace(/\s+/g, ''); // strip all spaces
  if (s === '') return { a: 0, b: 0, c: 0 };

  // Ensure leading sign
  if (s[0] !== '+' && s[0] !== '-') s = '+' + s;

  let a = 0;
  let b = 0;
  let c = 0;

  // Match terms: sign + optional number + optional variable part
  // Patterns: +3x^2, -x^2, +2x, -x, +5, -3.5
  const termRegex = /([+-])(\d*\.?\d*)(x\^2|x)?/g;
  let match: RegExpExecArray | null;
  let totalMatched = 0;

  while ((match = termRegex.exec(s)) !== null) {
    const [fullMatch, sign, numStr, varPart] = match;
    if (fullMatch === '' || (fullMatch === '+' || fullMatch === '-') && !numStr && !varPart) {
      // Avoid infinite loop on empty match
      if (fullMatch === '') { termRegex.lastIndex++; continue; }
    }
    // Skip pure sign-only matches with no number and no variable
    if (!numStr && !varPart) continue;

    totalMatched += fullMatch.length;

    const signMul = sign === '-' ? -1 : 1;

    if (varPart === 'x^2') {
      const coeff = numStr === '' ? 1 : parseFloat(numStr);
      if (isNaN(coeff)) return null;
      a += signMul * coeff;
    } else if (varPart === 'x') {
      const coeff = numStr === '' ? 1 : parseFloat(numStr);
      if (isNaN(coeff)) return null;
      b += signMul * coeff;
    } else if (numStr !== '') {
      const val = parseFloat(numStr);
      if (isNaN(val)) return null;
      c += signMul * val;
    }
  }

  // Validate: we should have consumed the entire string (ignoring the leading sign we added)
  // Allow small mismatches from signs
  const stripped = s.replace(/[+-]/g, '').replace(/\d*\.?\d*(x\^2|x)?/g, '');
  if (stripped.replace(/\s/g, '').length > 0) return null;

  return { a, b, c };
}

// ─── Solver ──────────────────────────────────────────────────────────────────

function solveEquation(eq: ParsedEquation, isEn: boolean): SolveResult {
  const { a, b, c, type } = eq;
  const steps: string[] = [];

  if (type === 'linear') {
    return solveLinear(b, c, steps, isEn, eq);
  }
  return solveQuadratic(a, b, c, steps, isEn, eq);
}

function solveLinear(
  a: number, // coefficient of x (what was 'b' in the parsed equation becomes 'a' here in ax+b=0 form)
  b: number, // constant
  steps: string[],
  isEn: boolean,
  eq: ParsedEquation,
): SolveResult {
  // Display: ax + b = 0
  steps.push(formatLinearEquation(a, b));

  if (a === 0) {
    if (b === 0) {
      steps.push(isEn ? '0 = 0 \u2014 identity (true for any x)' : '0 = 0 \u2014 \u0442\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u043E (\u0432\u0435\u0440\u043D\u043E \u043F\u0440\u0438 \u043B\u044E\u0431\u043E\u043C x)');
      return {
        equation: eq, steps, roots: [], rootType: 'identity',
        answerText: isEn ? 'Identity: true for any x' : '\u0422\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u043E: \u0432\u0435\u0440\u043D\u043E \u043F\u0440\u0438 \u043B\u044E\u0431\u043E\u043C x',
      };
    }
    steps.push(isEn ? 'No solution (coefficient of x is 0)' : '\u041D\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F (\u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u043F\u0440\u0438 x \u0440\u0430\u0432\u0435\u043D 0)');
    return {
      equation: eq, steps, roots: [], rootType: 'no-solution',
      answerText: isEn ? 'No solution' : '\u041D\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F',
    };
  }

  // Step 2: move constant
  steps.push(`${formatNum(a)}x = ${formatNum(-b)}`);

  // Step 3: divide
  const x = -b / a;
  steps.push(`x = ${formatNum(-b)} / ${formatNum(a)}`);

  // Step 4: result
  steps.push(`x = ${formatNum(x)}`);

  return {
    equation: eq, steps, roots: [x], rootType: 'one',
    answerText: `x = ${formatNum(x)}`,
  };
}

function solveQuadratic(
  a: number, b: number, c: number,
  steps: string[],
  isEn: boolean,
  eq: ParsedEquation,
): SolveResult {
  // Step 1: show equation
  steps.push(formatQuadraticEquation(a, b, c));

  // Step 2: identify coefficients
  steps.push(`a = ${formatNum(a)}, b = ${formatNum(b)}, c = ${formatNum(c)}`);

  // Step 3: discriminant
  const D = b * b - 4 * a * c;
  steps.push(`D = b\u00B2 \u2212 4ac = ${formatNum(b)}\u00B2 \u2212 4\u00B7${formatNum(a)}\u00B7${formatNum(c)} = ${formatNum(D)}`);

  if (D < 0) {
    steps.push(isEn ? 'D < 0 \u2014 no real roots' : 'D < 0 \u2014 \u043D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u0440\u043D\u0435\u0439');
    return {
      equation: eq, steps, roots: [], discriminant: D, rootType: 'none',
      answerText: isEn ? 'No real roots' : '\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u0440\u043D\u0435\u0439',
    };
  }

  if (D === 0) {
    const x = -b / (2 * a);
    steps.push(isEn ? 'D = 0 \u2014 one root (double)' : 'D = 0 \u2014 \u043E\u0434\u0438\u043D \u043A\u043E\u0440\u0435\u043D\u044C (\u043A\u0440\u0430\u0442\u043D\u044B\u0439)');
    steps.push(`x = \u2212b / (2a) = ${formatNum(-b)} / ${formatNum(2 * a)} = ${formatNum(x)}`);
    return {
      equation: eq, steps, roots: [x], discriminant: D, rootType: 'one',
      answerText: `x = ${formatNum(x)}`,
    };
  }

  // D > 0
  const sqrtD = Math.sqrt(D);
  steps.push(`\u221AD = \u221A${formatNum(D)} = ${formatNum(sqrtD)}`);

  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);
  steps.push(`x\u2081 = (\u2212b + \u221AD) / (2a) = (${formatNum(-b)} + ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x1)}`);
  steps.push(`x\u2082 = (\u2212b \u2212 \u221AD) / (2a) = (${formatNum(-b)} \u2212 ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x2)}`);

  return {
    equation: eq, steps, roots: [x1, x2], discriminant: D, rootType: 'two',
    answerText: `x\u2081 = ${formatNum(x1)}, x\u2082 = ${formatNum(x2)}`,
  };
}

// ─── Equation formatters ─────────────────────────────────────────────────────

function formatCoeffTerm(
  coeff: number,
  varName: string,
  isFirst: boolean,
): string {
  if (coeff === 0) return '';
  const absCoeff = Math.abs(coeff);
  const sign = coeff < 0 ? '\u2212' : (isFirst ? '' : '+');
  const space = isFirst ? '' : ' ';
  const num = absCoeff === 1 ? '' : formatNum(absCoeff);
  return `${space}${sign} ${num}${varName}`;
}

function formatConstTerm(c: number, isFirst: boolean): string {
  if (c === 0) return '';
  const sign = c < 0 ? '\u2212' : (isFirst ? '' : '+');
  const space = isFirst ? '' : ' ';
  return `${space}${sign} ${formatNum(Math.abs(c))}`;
}

function formatLinearEquation(a: number, b: number): string {
  const parts: string[] = [];
  const t1 = formatCoeffTerm(a, 'x', parts.length === 0);
  if (t1) parts.push(t1);
  const t2 = formatConstTerm(b, parts.length === 0);
  if (t2) parts.push(t2);
  if (parts.length === 0) parts.push('0');
  return parts.join('').trim() + ' = 0';
}

function formatQuadraticEquation(a: number, b: number, c: number): string {
  const parts: string[] = [];
  const t1 = formatCoeffTerm(a, 'x\u00B2', parts.length === 0);
  if (t1) parts.push(t1);
  const t2 = formatCoeffTerm(b, 'x', parts.length === 0);
  if (t2) parts.push(t2);
  const t3 = formatConstTerm(c, parts.length === 0);
  if (t3) parts.push(t3);
  if (parts.length === 0) parts.push('0');
  return parts.join('').trim() + ' = 0';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EquationSolver() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [input, setInput] = useState('');
  const [result, setResult] = useState<SolveResult | null>(null);
  const [error, setError] = useState('');

  const handleSolve = useCallback(() => {
    setResult(null);
    setError('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError(isEn ? 'Please enter an equation' : '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435');
      return;
    }

    const parsed = parseEquation(trimmed);
    if (!parsed) {
      setError(
        isEn
          ? 'Check equation format. Example: 2x^2 + 4x - 6 = 0'
          : '\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0444\u043E\u0440\u043C\u0430\u0442 \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F. \u041F\u0440\u0438\u043C\u0435\u0440: 2x^2 + 4x - 6 = 0',
      );
      return;
    }

    // Additional validation: if both a (x^2) and b (x) are zero and c is zero for linear
    if (parsed.type === 'linear' && parsed.b === 0 && parsed.c === 0) {
      // Identity, still solve it
    }

    const solved = solveEquation(parsed, isEn);
    setResult(solved);
  }, [input, isEn]);

  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSolve();
    },
    [handleSolve],
  );

  /** Pretty-display the input: x^2 → x² */
  const displayInput = useMemo(() => prettify(input), [input]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow,
          transition: 'background 0.2s ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <FunctionsRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEn ? 'Equation Solver' : '\u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0439'}
          </Typography>
        </Box>

        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isEn
              ? 'Enter equation, e.g.: 2x^2 + 4x - 6 = 0'
              : '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 2x^2 + 4x - 6 = 0'
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 14,
              fontSize: '1.1rem',
              fontFamily: 'monospace',
              backgroundColor: theme.palette.surfaceContainerHigh,
            },
          }}
          slotProps={{
            input: {
              autoComplete: 'off',
              spellCheck: false,
            },
          }}
        />

        {/* Auto-formatted preview */}
        {input && displayInput !== input && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              ml: 1.5,
              fontFamily: 'monospace',
              color: 'text.secondary',
              fontSize: '0.85rem',
            }}
          >
            {isEn ? 'Preview: ' : '\u041F\u0440\u0435\u0432\u044C\u044E: '}{displayInput}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowRoundedIcon />}
            onClick={handleSolve}
            disabled={!input.trim()}
            sx={{
              borderRadius: 14,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.2,
            }}
          >
            {isEn ? 'Solve' : '\u0420\u0435\u0448\u0438\u0442\u044C'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearRoundedIcon />}
            onClick={handleClear}
            disabled={!input && !result && !error}
            sx={{
              borderRadius: 14,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.2,
            }}
          >
            {isEn ? 'Clear' : '\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C'}
          </Button>
        </Box>
      </Paper>

      {/* Error display */}
      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2,
            borderRadius: 18,
            background: alpha(theme.palette.error.main, 0.06),
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ color: 'error.main' }} />
          <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
            {error}
          </Typography>
        </Paper>
      )}

      {/* Result section */}
      {result && (
        <>
          {/* Equation type chip + answer card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 18,
              background: theme.palette.surfaceContainerLow,
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: 14, right: 14 }}>
              <CopyButton text={result.answerText} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={
                  result.equation.type === 'quadratic'
                    ? (isEn ? 'Quadratic' : '\u041A\u0432\u0430\u0434\u0440\u0430\u0442\u043D\u043E\u0435')
                    : (isEn ? 'Linear' : '\u041B\u0438\u043D\u0435\u0439\u043D\u043E\u0435')
                }
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600, borderRadius: 10 }}
              />
              {result.discriminant !== undefined && (
                <Chip
                  label={`D = ${formatNum(result.discriminant)}`}
                  color={
                    result.rootType === 'none'
                      ? 'error'
                      : result.rootType === 'two'
                        ? 'success'
                        : 'warning'
                  }
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, borderRadius: 10 }}
                />
              )}
            </Box>

            {/* Final answer */}
            <Box sx={{ textAlign: 'center', py: 1 }}>
              {result.rootType === 'identity' && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {isEn ? 'Identity' : '\u0422\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u043E'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {isEn ? 'True for any x' : '\u0412\u0435\u0440\u043D\u043E \u043F\u0440\u0438 \u043B\u044E\u0431\u043E\u043C x'}
                  </Typography>
                </>
              )}
              {result.rootType === 'no-solution' && (
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {isEn ? 'No solution' : '\u041D\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F'}
                </Typography>
              )}
              {result.rootType === 'none' && (
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {isEn ? 'No real roots' : '\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u0440\u043D\u0435\u0439'}
                </Typography>
              )}
              {result.rootType === 'one' && result.roots.length === 1 && (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}
                >
                  x = {formatNum(result.roots[0])}
                </Typography>
              )}
              {result.rootType === 'two' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: { xs: 3, sm: 6 },
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">x&#x2081;</Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}
                    >
                      {formatNum(result.roots[0])}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">x&#x2082;</Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}
                    >
                      {formatNum(result.roots[1])}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Step-by-step solution */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 18,
              background: alpha(theme.palette.info.main, 0.04),
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              {isEn ? 'Step-by-step solution' : '\u041F\u043E\u0448\u0430\u0433\u043E\u0432\u043E\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u0435'}
            </Typography>
            {result.steps.map((step, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  mb: 1.2,
                }}
              >
                <Chip
                  label={i + 1}
                  size="small"
                  sx={{
                    minWidth: 28,
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor: theme.palette.surfaceContainerHigh,
                    color: 'primary.main',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: '0.9rem', pt: 0.2, wordBreak: 'break-word' }}
                >
                  {prettify(step)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
}
