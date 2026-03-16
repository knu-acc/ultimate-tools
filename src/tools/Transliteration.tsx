'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


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
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('cyr-to-lat');

  const output = input
    ? mode === 'cyr-to-lat'
      ? cyrToLat(input)
      : latToCyr(input)
    : '';

  const toggleMode = () => {
    setMode((prev) => (prev === 'cyr-to-lat' ? 'lat-to-cyr' : 'cyr-to-lat'));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
          <Chip
            label={isEn ? 'Cyrillic' : 'Кириллица'}
            color={mode === 'cyr-to-lat' ? 'primary' : 'default'}
            variant={mode === 'cyr-to-lat' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: '0.85rem', px: 1 }}
          />
          <IconButton
            onClick={toggleMode}
            sx={{
              borderRadius: 10,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          >
            <SwapVertIcon />
          </IconButton>
          <Chip
            label={isEn ? 'Latin' : 'Латиница'}
            color={mode === 'lat-to-cyr' ? 'primary' : 'default'}
            variant={mode === 'lat-to-cyr' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: '0.85rem', px: 1 }}
          />
        </Box>

        <TextField
          multiline
          rows={4}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'cyr-to-lat' ? (isEn ? 'Cyrillic...' : 'Кириллица...') : 'Latinitsa...'}
          sx={{
            mb: 1,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        {output && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={5}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  background: alpha(theme.palette.text.primary, 0.03)
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
