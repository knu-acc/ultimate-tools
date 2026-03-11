'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const CYR_TO_LAT: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
  'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
  'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
  'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
  'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
  'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
  'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
  'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
  'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
};

// Build reverse mapping (Latin → Cyrillic), longest keys first for greedy matching
const LAT_TO_CYR_LOWER: [string, string][] = [];
const LAT_TO_CYR_UPPER: [string, string][] = [];

for (const [cyr, lat] of Object.entries(CYR_TO_LAT)) {
  if (!lat) continue; // skip ъ, ь
  if (cyr === cyr.toLowerCase()) {
    LAT_TO_CYR_LOWER.push([lat, cyr]);
  } else {
    LAT_TO_CYR_UPPER.push([lat, cyr]);
  }
}

// Sort by length descending so multi-char sequences match first
const LAT_TO_CYR_ALL = [...LAT_TO_CYR_UPPER, ...LAT_TO_CYR_LOWER].sort(
  (a, b) => b[0].length - a[0].length
);

function cyrToLat(text: string): string {
  let result = '';
  for (const ch of text) {
    result += CYR_TO_LAT[ch] ?? ch;
  }
  return result;
}

function latToCyr(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const [lat, cyr] of LAT_TO_CYR_ALL) {
      if (text.substring(i, i + lat.length) === lat) {
        result += cyr;
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += text[i];
      i++;
    }
  }
  return result;
}

type Mode = 'cyr-to-lat' | 'lat-to-cyr';

export default function Transliteration() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('cyr-to-lat');
  const [copied, setCopied] = useState(false);

  const output = input
    ? mode === 'cyr-to-lat'
      ? cyrToLat(input)
      : latToCyr(input)
    : '';

  const toggleMode = () => {
    setMode((prev) => (prev === 'cyr-to-lat' ? 'lat-to-cyr' : 'cyr-to-lat'));
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {/* Mode toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mb: 3,
          }}
        >
          <Chip
            label="Кириллица"
            color={mode === 'cyr-to-lat' ? 'primary' : 'default'}
            variant={mode === 'cyr-to-lat' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: '0.85rem', px: 1 }}
          />
          <IconButton
            onClick={toggleMode}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              transition: 'all 200ms ease',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <SwapVertIcon />
          </IconButton>
          <Chip
            label="Латиница"
            color={mode === 'lat-to-cyr' ? 'primary' : 'default'}
            variant={mode === 'lat-to-cyr' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: '0.85rem', px: 1 }}
          />
        </Box>

        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          {mode === 'cyr-to-lat' ? 'Текст на кириллице' : 'Текст на латинице'}
        </Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCopied(false);
          }}
          placeholder={
            mode === 'cyr-to-lat'
              ? 'Введите текст на кириллице...'
              : 'Vvedite tekst na latinitse...'
          }
          sx={{
            mb: 1,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' },
          }}
        />

        {/* Character count */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Chip
            label={`${input.length} символов`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>

        {/* Output */}
        {output && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Результат
                </Typography>
                <Chip
                  label={
                    mode === 'cyr-to-lat'
                      ? 'Кириллица → Латиница'
                      : 'Латиница → Кириллица'
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={copyToClipboard}
                color={copied ? 'success' : 'primary'}
                variant="outlined"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </Button>
            </Box>
            <TextField
              multiline
              rows={5}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                mb: 1,
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  background: theme.palette.background.default,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Chip
                label={`${output.length} символов`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
