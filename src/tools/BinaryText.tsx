'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Grid,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import SwapVert from '@mui/icons-material/SwapVert';
import { CopyButton } from '@/src/components/CopyButton';


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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        {/* Mode toggle */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label="Текст → Двоичный"
            variant={isTextMode ? 'filled' : 'outlined'}
            color={isTextMode ? 'primary' : 'default'}
            onClick={() => { setMode('text-to-binary'); setInput(''); }}
            sx={{ fontWeight: 600, borderRadius: 2, px: 1 }}
          />
          <Chip
            label="Двоичный → Текст"
            variant={!isTextMode ? 'filled' : 'outlined'}
            color={!isTextMode ? 'primary' : 'default'}
            onClick={() => { setMode('binary-to-text'); setInput(''); }}
            sx={{ fontWeight: 600, borderRadius: 2, px: 1 }}
          />
        </Box>

        {/* Input area */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <TextField
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
                fontSize: '0.95rem'
              }
            }}
          />
          {/* Swap button */}
          {hasInput && (
            <Box
              component="button"
              onClick={handleSwap}
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.surfaceContainerLow,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                fontWeight: 600,
                fontSize: '0.8rem',
                color: theme.palette.text.secondary
              }}
            >
              <SwapVert sx={{ fontSize: 16 }} />
              Поменять
            </Box>
          )}
        </Box>

        {/* Main result */}
        {hasInput && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
              <CopyButton text={mainResult} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.text.primary, 0.03),
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.95rem'
                }}
              >
                {mainResult || '\u2014'}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Representations grid */}
        {hasInput && (
          <Grid container spacing={2}>
            {representations.map((r) => (
              <Grid size={{ xs: 12, sm: 6 }} key={r.key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: theme.palette.surfaceContainerLow
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
                      {r.label}
                    </Box>
                    <CopyButton text={r.value} />
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.85rem',
                      maxHeight: 100,
                      overflow: 'auto',
                      display: 'block'
                    }}
                  >
                    {r.value || '\u2014'}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
