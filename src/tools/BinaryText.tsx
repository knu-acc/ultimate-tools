'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import SwapVert from '@mui/icons-material/SwapVert';

type Mode = 'text-to-binary' | 'binary-to-text';

function textToBinary(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.codePointAt(0);
      if (code === undefined) return '';
      if (code <= 0x7f) return code.toString(2).padStart(8, '0');
      const bytes: string[] = [];
      const encoded = new TextEncoder().encode(ch);
      encoded.forEach((b) => bytes.push(b.toString(2).padStart(8, '0')));
      return bytes.join(' ');
    })
    .join(' ');
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/[^01]/g, ' ').trim();
  if (!cleaned) return '';
  const groups = cleaned.split(/\s+/).filter(Boolean);
  const bytes: number[] = [];
  for (const g of groups) {
    if (!/^[01]+$/.test(g)) return '[Ошибка: некорректный двоичный код]';
    if (g.length > 8) {
      for (let i = 0; i < g.length; i += 8) {
        const chunk = g.slice(i, i + 8);
        if (chunk.length === 8) bytes.push(parseInt(chunk, 2));
      }
    } else {
      bytes.push(parseInt(g.padStart(8, '0'), 2));
    }
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
  }
}

function textToHex(text: string): string {
  const encoded = new TextEncoder().encode(text);
  return Array.from(encoded)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

function textToOctal(text: string): string {
  const encoded = new TextEncoder().encode(text);
  return Array.from(encoded)
    .map((b) => b.toString(8).padStart(3, '0'))
    .join(' ');
}

function textToDecimal(text: string): string {
  const encoded = new TextEncoder().encode(text);
  return Array.from(encoded)
    .map((b) => b.toString(10))
    .join(' ');
}

function binaryToBytes(binary: string): number[] {
  const cleaned = binary.replace(/[^01]/g, ' ').trim();
  if (!cleaned) return [];
  const groups = cleaned.split(/\s+/).filter(Boolean);
  const bytes: number[] = [];
  for (const g of groups) {
    if (!/^[01]+$/.test(g)) continue;
    if (g.length > 8) {
      for (let i = 0; i < g.length; i += 8) {
        const chunk = g.slice(i, i + 8);
        if (chunk.length === 8) bytes.push(parseInt(chunk, 2));
      }
    } else {
      bytes.push(parseInt(g.padStart(8, '0'), 2));
    }
  }
  return bytes;
}

export default function BinaryText() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('text-to-binary');
  const [copied, setCopied] = useState('');

  const isTextMode = mode === 'text-to-binary';

  const sourceText = isTextMode ? input : binaryToText(input);
  const binary = isTextMode ? textToBinary(input) : input;

  let hexOutput = '';
  let octalOutput = '';
  let decimalOutput = '';

  if (isTextMode && input) {
    hexOutput = textToHex(input);
    octalOutput = textToOctal(input);
    decimalOutput = textToDecimal(input);
  } else if (!isTextMode && input) {
    const bytes = binaryToBytes(input);
    hexOutput = bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
    octalOutput = bytes.map((b) => b.toString(8).padStart(3, '0')).join(' ');
    decimalOutput = bytes.map((b) => b.toString(10)).join(' ');
  }

  const mainResult = isTextMode ? binary : sourceText;

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* ignore */ }
  };

  const handleSwap = () => {
    const newMode: Mode = isTextMode ? 'binary-to-text' : 'text-to-binary';
    const newInput = mainResult;
    setMode(newMode);
    setInput(newInput);
  };

  const representations = [
    { key: 'binary', label: 'Двоичное (Binary)', value: isTextMode ? binary : input },
    { key: 'hex', label: 'Шестнадцатеричное (Hex)', value: hexOutput },
    { key: 'octal', label: 'Восьмеричное (Octal)', value: octalOutput },
    { key: 'decimal', label: 'Десятичное (Decimal)', value: decimalOutput },
  ];

  const hasInput = input.trim().length > 0;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
          borderRadius: 4,
        }}
      >
        {/* Mode toggle */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label="Текст → Двоичный"
            variant={isTextMode ? 'filled' : 'outlined'}
            color={isTextMode ? 'primary' : 'default'}
            onClick={() => { setMode('text-to-binary'); setInput(''); }}
            sx={{ fontWeight: 600, borderRadius: 3, px: 1 }}
          />
          <Chip
            label="Двоичный → Текст"
            variant={!isTextMode ? 'filled' : 'outlined'}
            color={!isTextMode ? 'primary' : 'default'}
            onClick={() => { setMode('binary-to-text'); setInput(''); }}
            sx={{ fontWeight: 600, borderRadius: 3, px: 1 }}
          />
        </Box>

        {/* Input area */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <TextField
            label={isTextMode ? 'Введите текст' : 'Введите двоичный код (через пробел)'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline
            minRows={4}
            maxRows={10}
            fullWidth
            placeholder={isTextMode ? 'Привет, мир!' : '01010000 01110010 01101001'}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.95rem',
              },
            }}
          />
          {/* Swap button */}
          {hasInput && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<SwapVert />}
              onClick={handleSwap}
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Поменять
            </Button>
          )}
        </Box>

        {/* Main result */}
        {hasInput && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {isTextMode ? 'Двоичный результат' : 'Текстовый результат'}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleCopy('main', mainResult)}
                sx={{
                  color: copied === 'main' ? theme.palette.success.main : 'text.secondary',
                }}
              >
                <ContentCopy sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.background.default, 0.6),
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.95rem',
                }}
              >
                {mainResult || '—'}
              </Typography>
            </Paper>
            {copied === 'main' && (
              <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                Скопировано!
              </Typography>
            )}
          </Box>
        )}

        {/* Representations grid */}
        {hasInput && (
          <>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Все представления
            </Typography>
            <Grid container spacing={2}>
              {representations.map((r) => (
                <Grid size={{ xs: 12, sm: 6 }} key={r.key}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                      transition: 'all 200ms ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        background: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {r.label}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(r.key, r.value)}
                        sx={{
                          color: copied === r.key ? theme.palette.success.main : 'text.secondary',
                          transition: 'color 200ms',
                        }}
                      >
                        <ContentCopy sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.85rem',
                        maxHeight: 100,
                        overflow: 'auto',
                      }}
                    >
                      {r.value || '—'}
                    </Typography>
                    {copied === r.key && (
                      <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                        Скопировано!
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Empty state */}
        {!hasInput && (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {isTextMode
              ? 'Введите текст для преобразования в двоичный код'
              : 'Введите двоичный код для преобразования в текст'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
