'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Chip,
  Collapse,
  Divider,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useLanguage } from '@/src/i18n/LanguageContext';

// ── helpers ────────────────────────────────────────────────────────────
const OPERATORS = ['+', '-', '*', '/'];
const OPERATOR_RE = /[+\-*/]$/;
const MONO = '"JetBrains Mono", "Fira Code", monospace';

/** Strip trailing operators so "9+9+" becomes "9+9" */
function stripTrailingOps(expr: string): string {
  return expr.replace(/[+\-*/]+$/, '');
}

/** Replace display-only symbols with JS-evaluable equivalents */
function sanitize(raw: string): string {
  let s = raw
    .replace(/\u00d7/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\u2212/g, '-')
    .replace(/\u03c0/g, `(${Math.PI})`)
    .replace(/e(?![x(])/g, `(${Math.E})`)
    .replace(/%/g, '*0.01');

  s = s
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/\^/g, '**');

  // auto-close unbalanced parens
  const open = (s.match(/\(/g) || []).length;
  const close = (s.match(/\)/g) || []).length;
  s += ')'.repeat(Math.max(0, open - close));

  return s;
}

function safeEval(expr: string): number {
  // validate: after sanitisation only digits, operators, parens, dots, Math.* remain
  const check = expr.replace(/Math\.\w+/g, '').replace(/\*\*/g, '');
  if (!/^[\d+\-*/().eE\s]*$/.test(check)) {
    throw new Error('Invalid expression');
  }
  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${expr})`)();
  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error('Invalid result');
  }
  return result;
}

function formatResult(n: number): string {
  return Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(10)).toString();
}

// ── component ──────────────────────────────────────────────────────────
export default function ScientificCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  // State – display never contains error text
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // ── error helper ───────────────────────────────────────────────────
  const showError = useCallback((msg: string) => {
    setError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 2000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    if (errorTimer.current) clearTimeout(errorTimer.current);
  }, []);

  // cleanup timer on unmount
  useEffect(() => () => {
    if (errorTimer.current) clearTimeout(errorTimer.current);
  }, []);

  // ── input handlers ─────────────────────────────────────────────────
  const appendToDisplay = useCallback(
    (value: string) => {
      clearError();
      // After a completed calculation, typing a number starts fresh
      if (lastResult !== null && /^[0-9.]/.test(value)) {
        setDisplay(value);
        setExpression('');
        setLastResult(null);
        return;
      }
      setLastResult(null);
      setDisplay((prev) => {
        if (prev === '0' && value !== '.') return value;
        return prev + value;
      });
    },
    [lastResult, clearError],
  );

  const appendOperator = useCallback(
    (op: string) => {
      clearError();
      setLastResult(null);
      setDisplay((prev) => {
        // Replace the last operator(s) instead of stacking
        if (OPERATOR_RE.test(prev)) {
          return prev.replace(/[+\-*/]+$/, '') + op;
        }
        // Don't allow operator at the very start (except minus for negative)
        if (prev === '0' && op !== '-') return prev;
        return prev + op;
      });
    },
    [clearError],
  );

  const appendFunction = useCallback(
    (fn: string) => {
      clearError();
      if (lastResult !== null) {
        setDisplay(`${fn}(${lastResult})`);
        setLastResult(null);
        return;
      }
      setDisplay((prev) => {
        if (prev === '0') return `${fn}(`;
        return `${prev}${fn}(`;
      });
    },
    [lastResult, clearError],
  );

  const appendPercent = useCallback(() => {
    clearError();
    setDisplay((prev) => {
      if (prev === '0') return prev;
      return prev + '%';
    });
  }, [clearError]);

  // AC – full clear
  const allClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
    clearError();
  }, [clearError]);

  // C / Backspace – delete last char
  const backspace = useCallback(() => {
    clearError();
    setDisplay((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, [clearError]);

  // Calculate
  const calculate = useCallback(() => {
    clearError();
    const trimmed = stripTrailingOps(display);
    if (!trimmed || trimmed === '0') return;

    try {
      const sanitized = sanitize(trimmed);
      const result = safeEval(sanitized);
      const formatted = formatResult(result);

      setExpression(display);
      setHistory((prev) => [{ expr: display, result: formatted }, ...prev.slice(0, 9)]);
      setDisplay(formatted);
      setLastResult(formatted);
    } catch {
      showError(isEn ? 'Invalid expression' : 'Неверное выражение');
    }
  }, [display, clearError, showError, isEn]);

  // ── keyboard support ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only handle when this component could be focused
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        appendToDisplay(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        appendOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        appendOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        appendOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        appendToDisplay(e.key);
      } else if (e.key === '%') {
        e.preventDefault();
        appendPercent();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        allClear();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [appendToDisplay, appendOperator, appendPercent, calculate, backspace, allClear]);

  // ── button styles ──────────────────────────────────────────────────
  const btnBase = {
    borderRadius: 10.5,
    minWidth: 0,
    fontFamily: MONO,
    fontSize: '1.15rem',
    fontWeight: 600,
    py: 2,
    transition: 'background-color 120ms ease, transform 80ms ease',
  };

  const btnNumber = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.text.primary, 0.06),
    color: 'text.primary',
    '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.12) },
    '&:active': { transform: 'scale(0.95)' },
  };

  const btnOperator = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: 'primary.main',
    fontWeight: 700,
    fontSize: '1.3rem',
    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.25) },
    '&:active': { transform: 'scale(0.95)' },
  };

  const btnEquals = {
    ...btnBase,
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    fontSize: '1.3rem',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: 'primary.dark',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '&:active': { transform: 'scale(0.95)' },
  };

  const btnClear = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    color: 'error.main',
    fontWeight: 700,
    '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.22) },
    '&:active': { transform: 'scale(0.95)' },
  };

  const btnFunction = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: 'text.secondary',
    fontSize: '0.85rem',
    fontWeight: 600,
    '&:hover': { backgroundColor: alpha(theme.palette.secondary.main, 0.2) },
    '&:active': { transform: 'scale(0.95)' },
  };

  // ── button layout ──────────────────────────────────────────────────
  const mainRows: { label: string; action: () => void; style: object }[][] = [
    [
      { label: 'AC', action: allClear, style: btnClear },
      { label: '(', action: () => appendToDisplay('('), style: btnFunction },
      { label: ')', action: () => appendToDisplay(')'), style: btnFunction },
      { label: '\u00F7', action: () => appendOperator('/'), style: btnOperator },
    ],
    [
      { label: '7', action: () => appendToDisplay('7'), style: btnNumber },
      { label: '8', action: () => appendToDisplay('8'), style: btnNumber },
      { label: '9', action: () => appendToDisplay('9'), style: btnNumber },
      { label: '\u00D7', action: () => appendOperator('*'), style: btnOperator },
    ],
    [
      { label: '4', action: () => appendToDisplay('4'), style: btnNumber },
      { label: '5', action: () => appendToDisplay('5'), style: btnNumber },
      { label: '6', action: () => appendToDisplay('6'), style: btnNumber },
      { label: '\u2212', action: () => appendOperator('-'), style: btnOperator },
    ],
    [
      { label: '1', action: () => appendToDisplay('1'), style: btnNumber },
      { label: '2', action: () => appendToDisplay('2'), style: btnNumber },
      { label: '3', action: () => appendToDisplay('3'), style: btnNumber },
      { label: '+', action: () => appendOperator('+'), style: btnOperator },
    ],
    [
      { label: '0', action: () => appendToDisplay('0'), style: btnNumber },
      { label: '.', action: () => appendToDisplay('.'), style: btnNumber },
      { label: '\u232B', action: backspace, style: btnClear },
      { label: '=', action: calculate, style: btnEquals },
    ],
  ];

  const scientificButtons: { label: string; action: () => void }[] = [
    { label: 'sin', action: () => appendFunction('sin') },
    { label: 'cos', action: () => appendFunction('cos') },
    { label: 'tan', action: () => appendFunction('tan') },
    { label: 'log', action: () => appendFunction('log') },
    { label: 'ln', action: () => appendFunction('ln') },
    { label: '\u221A', action: () => appendFunction('sqrt') },
    { label: '\u03C0', action: () => appendToDisplay('\u03C0') },
    { label: 'e', action: () => appendToDisplay('e') },
    { label: 'x\u00B2', action: () => appendToDisplay('^2') },
    { label: '%', action: appendPercent },
  ];

  // ── display font size (auto-sizing) ────────────────────────────────
  const displayFontSize =
    display.length > 18
      ? '1.25rem'
      : display.length > 14
        ? '1.5rem'
        : display.length > 10
          ? '2rem'
          : '2.75rem';

  // ── render ─────────────────────────────────────────────────────────
  return (
    <Box ref={rootRef} sx={{ maxWidth: 420, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 18,
          overflow: 'hidden',
        }}
      >
        {/* ── Display ──────────────────────────────────────────── */}
        <Box
          sx={{
            position: 'relative',
            px: 3,
            pt: 3,
            pb: 2.5,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.black, 0.4)
                : alpha(theme.palette.grey[900], 0.95),
            color: theme.palette.common.white,
          }}
        >
          {/* Previous expression */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: MONO,
              textAlign: 'right',
              color: alpha(theme.palette.common.white, 0.5),
              minHeight: 22,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {expression || '\u00A0'}
          </Typography>

          {/* Current display */}
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: displayFontSize,
              fontWeight: 300,
              textAlign: 'right',
              wordBreak: 'break-all',
              lineHeight: 1.2,
              transition: 'font-size 200ms ease',
              color: theme.palette.common.white,
              minHeight: '3.3rem',
            }}
          >
            {display}
          </Typography>

          {/* ── Error overlay chip ───────────────────────────── */}
          <Fade in={error !== null} timeout={200}>
            <Chip
              label={error}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: MONO,
                fontWeight: 600,
                fontSize: '0.78rem',
                backgroundColor: alpha(theme.palette.error.main, 0.9),
                color: theme.palette.error.contrastText,
                pointerEvents: 'none',
                zIndex: 2,
                backdropFilter: 'blur(4px)',
              }}
            />
          </Fade>
        </Box>

        {/* ── Scientific Toggle ─────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            size="small"
            startIcon={<FunctionsIcon />}
            endIcon={showScientific ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowScientific((p) => !p)}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8rem',
              py: 0.75,
            }}
          >
            {isEn ? 'Scientific mode' : 'Научный режим'}
          </Button>
        </Box>

        {/* ── Scientific Buttons ────────────────────────────── */}
        <Collapse in={showScientific}>
          <Box sx={{ px: 1.5, pt: 1.5, pb: 0.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
              {scientificButtons.map((btn) => (
                <Chip
                  key={btn.label}
                  label={btn.label}
                  onClick={btn.action}
                  sx={{
                    fontFamily: MONO,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    minWidth: 52,
                    height: 36,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    },
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ mt: 1 }} />
        </Collapse>

        {/* ── Main Button Grid ──────────────────────────────── */}
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {mainRows.map((row, rowIndex) => (
            <Grid container spacing={0.75} key={rowIndex}>
              {row.map((btn) => (
                <Grid size={3} key={btn.label}>
                  <Button fullWidth onClick={btn.action} sx={btn.style}>
                    {btn.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>

        {/* ── History Toggle ────────────────────────────────── */}
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: theme.palette.surfaceContainerLow },
          }}
          onClick={() => setShowHistory((p) => !p)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'History' : 'История'} ({history.length})
            </Typography>
          </Box>
          {showHistory ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>

        {/* ── History Panel ─────────────────────────────────── */}
        <Collapse in={showHistory}>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            {history.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHistory([]);
                  }}
                  aria-label={isEn ? 'Clear history' : 'Очистить историю'}
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            )}
            {history.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                {isEn ? 'History is empty' : 'История пуста'}
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: 240,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                {history.map((item, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    onClick={() => {
                      setDisplay(item.result);
                      setLastResult(item.result);
                      clearError();
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 10,
                      cursor: 'pointer',
                      backgroundColor: theme.palette.surfaceContainerLow,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      '&:hover': {
                        backgroundColor: theme.palette.surfaceContainerHigh,
                        borderColor: theme.palette.primary.main,
                      },
                      transition: 'background-color 120ms ease',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: MONO,
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        textAlign: 'right',
                      }}
                    >
                      {item.expr}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: MONO,
                        fontWeight: 700,
                        textAlign: 'right',
                        color: 'primary.main',
                      }}
                    >
                      = {item.result}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
}
