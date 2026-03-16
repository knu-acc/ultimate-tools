'use client';

import { useState, useCallback } from 'react';
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
  useTheme,
  alpha
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function ScientificCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const appendToDisplay = useCallback(
    (value: string) => {
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
    [lastResult]
  );

  const appendOperator = useCallback(
    (op: string) => {
      setLastResult(null);
      setDisplay((prev) => {
        const last = prev.slice(-1);
        if (['+', '-', '*', '/'].includes(last)) {
          return prev.slice(0, -1) + op;
        }
        return prev + op;
      });
    },
    []
  );

  const appendFunction = useCallback(
    (fn: string) => {
      if (lastResult !== null) {
        setDisplay(fn + '(' + lastResult + ')');
        setLastResult(null);
        return;
      }
      setDisplay((prev) => {
        if (prev === '0') return fn + '(';
        return prev + fn + '(';
      });
    },
    [lastResult]
  );

  const clear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  }, []);

  const sanitizeExpression = (expr: string): string => {
    let sanitized = expr
      .replace(/\u00d7/g, '*')
      .replace(/\u00f7/g, '/')
      .replace(/\u2212/g, '-')
      .replace(/\u03c0/g, String(Math.PI))
      .replace(/e(?![x])/g, String(Math.E));

    sanitized = sanitized
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**');

    const isValid = /^[\d+\-*/().,%\s^eE]*$/.test(
      sanitized.replace(/Math\.\w+/g, '').replace(/\*\*/g, '')
    );

    if (!isValid) throw new Error('Invalid expression');
    return sanitized;
  };

  const errorText = isEn ? 'Error' : 'Ошибка';

  const calculate = useCallback(() => {
    try {
      const sanitized = sanitizeExpression(display);
      const openCount = (sanitized.match(/\(/g) || []).length;
      const closeCount = (sanitized.match(/\)/g) || []).length;
      const balanced = sanitized + ')'.repeat(Math.max(0, openCount - closeCount));

      const result = Function(`"use strict"; return (${balanced})`)();

      if (typeof result !== 'number' || !isFinite(result)) {
        setDisplay(errorText);
        return;
      }

      const formatted =
        Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();

      setExpression(display);
      setHistory((prev) => [{ expr: display, result: formatted }, ...prev.slice(0, 9)]);
      setDisplay(formatted);
      setLastResult(formatted);
    } catch {
      setDisplay(errorText);
    }
  }, [display, errorText]);

  const btnBase = {
    borderRadius: 2.5,
    minWidth: 0,
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '1.15rem',
    fontWeight: 600,
    py: 2,
    transitionProperty: 'background-color', transitionDuration: '120ms', transitionTimingFunction: 'ease'
  };

  const btnNumber = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.text.primary, 0.06),
    color: 'text.primary',
    '&:hover': {
      backgroundColor: alpha(theme.palette.text.primary, 0.12)
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  };

  const btnOperator = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: 'primary.main',
    fontWeight: 700,
    fontSize: '1.3rem',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.25)
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  };

  const btnEquals = {
    ...btnBase,
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    fontSize: '1.3rem',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: 'primary.dark',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  };

  const btnClear = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    color: 'error.main',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.22)
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  };

  const btnFunction = {
    ...btnBase,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: 'text.secondary',
    fontSize: '0.85rem',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.2)
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  };

  const mainRows: { label: string; action: () => void; style: object }[][] = [
    [
      { label: 'C', action: clear, style: btnClear },
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
  ];

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Display */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2.5,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.black, 0.4)
                : alpha(theme.palette.grey[900], 0.95),
            color: theme.palette.common.white
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              textAlign: 'right',
              color: alpha(theme.palette.common.white, 0.5),
              minHeight: 22,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {expression || '\u00A0'}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: display.length > 16 ? '1.5rem' : display.length > 10 ? '2rem' : '2.75rem',
              fontWeight: 300,
              textAlign: 'right',
              wordBreak: 'break-all',
              lineHeight: 1.2,
              transitionProperty: 'font-size', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              color: theme.palette.common.white
            }}
          >
            {display}
          </Typography>
        </Box>

        {/* Scientific Toggle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Button
            size="small"
            startIcon={<FunctionsIcon />}
            endIcon={showScientific ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowScientific(!showScientific)}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8rem',
              py: 0.75
            }}
          >
            {isEn ? 'Scientific mode' : 'Научный режим'}
          </Button>
        </Box>

        {/* Scientific Buttons */}
        <Collapse in={showScientific}>
          <Box sx={{ px: 1.5, pt: 1.5, pb: 0.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
              {scientificButtons.map((btn) => (
                <Chip
                  key={btn.label}
                  label={btn.label}
                  onClick={btn.action}
                  sx={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    minWidth: 52,
                    height: 36,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2)
                    },
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ mt: 1 }} />
        </Collapse>

        {/* Main Button Grid */}
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

        {/* History Toggle */}
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: theme.palette.surfaceContainerLow }
          }}
          onClick={() => setShowHistory(!showHistory)}
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

        {/* History Panel */}
        <Collapse in={showHistory}>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            {history.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton size="small" onClick={() => setHistory([])}>
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
              <Box sx={{ maxHeight: 240, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {history.map((item, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    onClick={() => {
                      setDisplay(item.result);
                      setLastResult(null);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      backgroundColor: theme.palette.surfaceContainerLow,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      '&:hover': {
                        backgroundColor: theme.palette.surfaceContainerHigh,
                        borderColor: theme.palette.primary.main
                      },
                      transitionProperty: 'background-color', transitionDuration: '120ms', transitionTimingFunction: 'ease'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        textAlign: 'right'
                      }}
                    >
                      {item.expr}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        fontWeight: 700,
                        textAlign: 'right',
                        color: 'primary.main'
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
